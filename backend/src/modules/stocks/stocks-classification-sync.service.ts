import { OperationResult } from 'mvc-common-toolkit';
import { Repository } from 'typeorm';

import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { getErrorMessage } from '@shared/helpers/common';

import { MLService } from '../ml/ml.service';
import { StockGroupMapping } from './stock-group-mapping.model';
import { StockGroup } from './stock-group.model';
import { Stock } from './stocks.model';

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
    chunkSize = 200,
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

      // Ensure special symbols (futures, bonds, indices) exist in the stocks table first
      const futuresList = groupedSymbols.FU_INDEX || [];
      const bondsList = groupedSymbols.FU_BOND || [];
      const indicesList = groupedSymbols.INDEX || [];

      const specialSymbolsToUpsert: any[] = [];
      futuresList.forEach((sym: string) => {
        specialSymbolsToUpsert.push({
          symbol: sym,
          exchange: 'DER',
          organ_name: 'Hợp đồng tương lai ' + sym,
          type: 'future',
        });
      });
      bondsList.forEach((sym: string) => {
        specialSymbolsToUpsert.push({
          symbol: sym,
          exchange: 'BOND',
          organ_name: 'Trái phiếu chính phủ ' + sym,
          type: 'bond',
        });
      });
      indicesList.forEach((sym: string) => {
        specialSymbolsToUpsert.push({
          symbol: sym,
          exchange: 'INDEX',
          organ_name: 'Chỉ số ' + sym,
          type: 'index',
        });
      });

      if (specialSymbolsToUpsert.length > 0) {
        this.logger.log(
          `Upserting ${specialSymbolsToUpsert.length} special securities into DB...`,
        );
        await this.upsertStocksInChunks(specialSymbolsToUpsert);
      }

      // 2. Fetch all stocks (including newly inserted ones) and clear existing mappings
      const allStocks = await this.repo.find();
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
      const vn30Set = new Set(
        (groupedSymbols.VN30 || []).map((s: string) => s.toUpperCase()),
      );
      const cwSet = new Set(
        (groupedSymbols.CW || []).map((s: string) => s.toUpperCase()),
      );
      const etfSet = new Set(
        (groupedSymbols.ETF || []).map((s: string) => s.toUpperCase()),
      );
      const fuIndexSet = new Set(
        (groupedSymbols.FU_INDEX || []).map((s: string) => s.toUpperCase()),
      );
      const fuBondSet = new Set(
        (groupedSymbols.FU_BOND || []).map((s: string) => s.toUpperCase()),
      );
      const indexSet = new Set(
        (groupedSymbols.INDEX || []).map((s: string) => s.toUpperCase()),
      );

      const newMappings: StockGroupMapping[] = [];

      for (const stock of allStocks) {
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

        // Map index groups
        let indexGroupCode: string | null = null;
        if (vn30Set.has(sym) && groupMap.has('VN30')) {
          const groupId = groupMap.get('VN30')!;
          if (!mappedGroupIds.has(groupId)) {
            const mapping = new StockGroupMapping();
            mapping.stockSymbol = stock.symbol;
            mapping.groupId = groupId;
            newMappings.push(mapping);
            mappedGroupIds.add(groupId);
          }
          indexGroupCode = 'VN30';
        }
        if (cwSet.has(sym) && groupMap.has('CW')) {
          const groupId = groupMap.get('CW')!;
          if (!mappedGroupIds.has(groupId)) {
            const mapping = new StockGroupMapping();
            mapping.stockSymbol = stock.symbol;
            mapping.groupId = groupId;
            newMappings.push(mapping);
            mappedGroupIds.add(groupId);
          }
          indexGroupCode = 'CW';
        }
        if (etfSet.has(sym) && groupMap.has('ETF')) {
          const groupId = groupMap.get('ETF')!;
          if (!mappedGroupIds.has(groupId)) {
            const mapping = new StockGroupMapping();
            mapping.stockSymbol = stock.symbol;
            mapping.groupId = groupId;
            newMappings.push(mapping);
            mappedGroupIds.add(groupId);
          }
          indexGroupCode = 'ETF';
        }
        if (fuIndexSet.has(sym) && groupMap.has('FU_INDEX')) {
          const groupId = groupMap.get('FU_INDEX')!;
          if (!mappedGroupIds.has(groupId)) {
            const mapping = new StockGroupMapping();
            mapping.stockSymbol = stock.symbol;
            mapping.groupId = groupId;
            newMappings.push(mapping);
            mappedGroupIds.add(groupId);
          }
          indexGroupCode = 'FU_INDEX';
        }
        if (fuBondSet.has(sym) && groupMap.has('FU_BOND')) {
          const groupId = groupMap.get('FU_BOND')!;
          if (!mappedGroupIds.has(groupId)) {
            const mapping = new StockGroupMapping();
            mapping.stockSymbol = stock.symbol;
            mapping.groupId = groupId;
            newMappings.push(mapping);
            mappedGroupIds.add(groupId);
          }
          indexGroupCode = 'FU_BOND';
        }
        if (indexSet.has(sym) && groupMap.has('INDEX')) {
          const groupId = groupMap.get('INDEX')!;
          if (!mappedGroupIds.has(groupId)) {
            const mapping = new StockGroupMapping();
            mapping.stockSymbol = stock.symbol;
            mapping.groupId = groupId;
            newMappings.push(mapping);
            mappedGroupIds.add(groupId);
          }
          indexGroupCode = 'INDEX';
        }
        stock.indexGroup = indexGroupCode;
      }

      // 3. Save stocks (for backward compatibility column) and mappings in chunks
      const chunkSize = 200;
      for (let i = 0; i < allStocks.length; i += chunkSize) {
        await this.repo.save(allStocks.slice(i, i + chunkSize));
      }

      for (let i = 0; i < newMappings.length; i += chunkSize) {
        await this.mappingRepo.save(newMappings.slice(i, i + chunkSize));
      }

      this.logger.log('Stock classifications sync completed.');
      return {
        success: true,
        message: 'Synced stock classifications successfully',
        data: {
          total: allStocks.length,
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
