import { OperationResult } from 'mvc-common-toolkit';
import { Repository } from 'typeorm';

import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { MLService } from '@modules/ml/services/ml.service';

import { getErrorMessage } from '@shared/helpers/common';

import { StockGroupMapping } from '../entities/stock-group-mapping.model';
import { StockGroup } from '../entities/stock-group.model';
import { Stock } from '../entities/stocks.model';

@Injectable()
export class StocksClassificationSyncService {
  private readonly logger = new Logger(StocksClassificationSyncService.name);

  constructor(
    @InjectRepository(Stock)
    private readonly repo: Repository<Stock>,

    @InjectRepository(StockGroup)
    private readonly groupRepo: Repository<StockGroup>,

    @InjectRepository(StockGroupMapping)
    private readonly mappingRepo: Repository<StockGroupMapping>,

    private readonly mlService: MLService,
  ) {}

  public async upsertStocksInChunks(
    crawledItems: any[],
    chunkSize = 80,
  ): Promise<number> {
    let insertedCount = 0;

    for (let i = 0; i < crawledItems.length; i += chunkSize) {
      const chunk = crawledItems.slice(i, i + chunkSize);
      const stockEntities = chunk.map((item) => {
        const stock = new Stock();
        stock.symbol = item.symbol;
        stock.exchange = item.exchange;
        stock.name = item.organ_name || item.organ_short_name || '';
        stock.type = item.type;
        stock.sid = item.sid;
        stock.enOrganName = item.en_organ_name;
        stock.enOrganShortName = item.en_organ_short_name;
        stock.organShortName = item.organ_short_name;
        stock.organName = item.organ_name;
        stock.productGrpId = item.product_grp_id;
        stock.icbCode2 = item.icb_code2;
        return stock;
      });

      await this.repo.upsert(stockEntities, ['symbol']);
      insertedCount += chunk.length;
    }

    return insertedCount;
  }

  public async syncClassifications(): Promise<OperationResult> {
    try {
      this.logger.log(
        'Starting sync of stock classifications from Python microservice...',
      );
      const response = await this.mlService.getGroupedSymbols();
      if (!response.success || !response.data) {
        return {
          success: false,
          message: 'Failed to fetch grouped symbols from ML service',
        };
      }

      const groupedSymbols = response.data;

      // 1. Ensure stock_groups exist
      const groupsToCreate = [
        { code: 'HOSE', name: 'Sàn HOSE' },
        { code: 'HNX', name: 'Sàn HNX' },
        { code: 'UPCOM', name: 'Sàn UPCOM' },
        { code: 'VN30', name: 'Chỉ số VN30' },
        { code: 'CW', name: 'Chứng quyền' },
        { code: 'ETF', name: 'Quỹ ETF' },
        { code: 'FU_INDEX', name: 'Hợp đồng tương lai' },
        { code: 'FU_BOND', name: 'Trái phiếu chính phủ' },
        { code: 'INDEX', name: 'Bộ chỉ số' },
        { code: 'VN100', name: 'Chỉ số VN100' },
        { code: 'VNMID', name: 'Chỉ số VNMidCap' },
        { code: 'VNSML', name: 'Chỉ số VNSmallCap' },
        { code: 'VNSI', name: 'Chỉ số VNSI' },
        { code: 'VNX50', name: 'Chỉ số VNX50' },
        { code: 'VNXALL', name: 'Chỉ số VNXALL' },
        { code: 'VNALL', name: 'Chỉ số VNALL' },
        { code: 'HNX30', name: 'Chỉ số HNX30' },
      ];

      for (const g of groupsToCreate) {
        let group = await this.groupRepo.findOne({ where: { code: g.code } });
        if (!group) {
          group = this.groupRepo.create(g);
          await this.groupRepo.save(group);
        }
      }

      const dbGroups = await this.groupRepo.find();
      const groupMap = new Map<string, number>();
      dbGroups.forEach((g) => groupMap.set(g.code.toUpperCase(), g.id));

      // Build allowedSymbols dynamically from all groups
      const allowedSymbols = new Set<string>();
      Object.keys(groupedSymbols).forEach((key) => {
        const symbols = groupedSymbols[key] || [];
        symbols.forEach((s: string) => allowedSymbols.add(s.toUpperCase()));
      });

      // Add default index names we want to keep
      const indexCodes = [
        'VNINDEX',
        'VN30',
        'HNXINDEX',
        'UPCOMINDEX',
        'HNX30',
        'VNXALL',
        'VN100',
        'VNMID',
        'VNSML',
        'VNSI',
        'VNX50',
        'VNALL',
      ];
      indexCodes.forEach((code) => allowedSymbols.add(code.toUpperCase()));

      const indicesList = groupedSymbols.INDEX || [];
      const specialSymbolsToUpsert: any[] = [];
      indicesList.forEach((sym: string) => {
        if (allowedSymbols.has(sym.toUpperCase())) {
          specialSymbolsToUpsert.push({
            symbol: sym,
            exchange: 'INDEX',
            organ_name: 'Chỉ số ' + sym,
            type: 'index',
          });
        }
      });

      if (specialSymbolsToUpsert.length > 0) {
        this.logger.log(
          `Upserting ${specialSymbolsToUpsert.length} special securities into DB...`,
        );
        await this.upsertStocksInChunks(specialSymbolsToUpsert);
      }

      // 2. Fetch all stocks (including newly inserted ones) and clean up unrelated ones
      const allStocks = await this.repo.find();
      const stocksToKeep = allStocks.filter((stock) =>
        allowedSymbols.has(stock.symbol.toUpperCase()),
      );
      const stocksToDelete = allStocks.filter(
        (stock) => !allowedSymbols.has(stock.symbol.toUpperCase()),
      );

      if (stocksToDelete.length > 0) {
        this.logger.log(
          `Deleting ${stocksToDelete.length} unrelated stocks from database...`,
        );
        const deleteChunkSize = 80;
        for (let i = 0; i < stocksToDelete.length; i += deleteChunkSize) {
          await this.repo.remove(stocksToDelete.slice(i, i + deleteChunkSize));
        }
      }

      await this.mappingRepo.clear();

      const hoseSet = new Set(
        (groupedSymbols.HOSE || []).map((s: string) => s.toUpperCase()),
      );
      const hnxSet = new Set(
        (groupedSymbols.HNX || []).map((s: string) => s.toUpperCase()),
      );
      const upcomSet = new Set(
        (groupedSymbols.UPCOM || []).map((s: string) => s.toUpperCase()),
      );

      const groupKeys = [
        'VN30',
        'VN100',
        'VNMID',
        'VNSML',
        'VNSI',
        'VNX50',
        'VNXALL',
        'VNALL',
        'HNX30',
        'CW',
        'ETF',
        'FU_INDEX',
        'FU_BOND',
        'INDEX',
      ];

      const newMappings: StockGroupMapping[] = [];

      for (const stock of stocksToKeep) {
        const sym = stock.symbol.toUpperCase();
        const mappedGroupIds = new Set<number>();

        // Correct exchange name based on groups from vnstock
        if (hoseSet.has(sym)) {
          stock.exchange = 'HOSE';
        } else if (hnxSet.has(sym)) {
          stock.exchange = 'HNX';
        } else if (upcomSet.has(sym)) {
          stock.exchange = 'UPCOM';
        }

        const ex = (stock.exchange || '').toUpperCase();

        // Map exchange group
        if (ex && groupMap.has(ex)) {
          const groupId = groupMap.get(ex)!;
          const mapping = new StockGroupMapping();
          mapping.stockSymbol = stock.symbol;
          mapping.groupId = groupId;
          newMappings.push(mapping);
          mappedGroupIds.add(groupId);
        }

        // Map index groups dynamically
        let indexGroupCode: string | null = null;
        for (const key of groupKeys) {
          const keySet = new Set(
            (groupedSymbols[key] || []).map((s: string) => s.toUpperCase()),
          );
          if (keySet.has(sym) && groupMap.has(key)) {
            const groupId = groupMap.get(key)!;
            if (!mappedGroupIds.has(groupId)) {
              const mapping = new StockGroupMapping();
              mapping.stockSymbol = stock.symbol;
              mapping.groupId = groupId;
              newMappings.push(mapping);
              mappedGroupIds.add(groupId);
            }
            indexGroupCode = key;
          }
        }
        stock.indexGroup = indexGroupCode;
      }

      // 3. Save stocks (for backward compatibility column) and mappings in chunks
      const chunkSize = 80;
      for (let i = 0; i < stocksToKeep.length; i += chunkSize) {
        await this.repo.save(stocksToKeep.slice(i, i + chunkSize));
      }

      for (let i = 0; i < newMappings.length; i += chunkSize) {
        await this.mappingRepo.save(newMappings.slice(i, i + chunkSize));
      }

      this.logger.log('Stock classifications sync completed.');
      return {
        success: true,
        message: 'Synced stock classifications successfully',
        data: {
          total: stocksToKeep.length,
          mappingsCount: newMappings.length,
        },
      };
    } catch (error) {
      this.logger.error('Error in syncClassifications:', error);
      return {
        success: false,
        message: `Failed to sync stock classifications: ${getErrorMessage(error)}`,
      };
    }
  }

  public async getClassificationSummary(): Promise<OperationResult> {
    try {
      const allStocks = await this.repo.find();

      const summary = {
        HOSE: 0,
        HNX: 0,
        UPCOM: 0,
        VN30: 0,
        CW: 0,
        ETF: 0,
        FU_INDEX: 0,
        FU_BOND: 0,
        INDEX: 0,
        total: allStocks.length,
      };

      const mappingCounts = await this.mappingRepo
        .createQueryBuilder('mapping')
        .innerJoin('mapping.stockGroup', 'sg')
        .select('sg.code', 'code')
        .addSelect('COUNT(mapping.id)', 'count')
        .groupBy('sg.code')
        .getRawMany();

      mappingCounts.forEach((row) => {
        const code = (row.code || '').toUpperCase();
        const count = parseInt(row.count, 10) || 0;
        if (code in summary) {
          summary[code as keyof typeof summary] = count;
        }
      });

      return {
        success: true,
        data: summary,
      };
    } catch (error) {
      this.logger.error('Error getting classification summary:', error);
      return {
        success: false,
        message: `Failed to get classification summary: ${getErrorMessage(error)}`,
      };
    }
  }
}
