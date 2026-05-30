import {
  AuditService,
  AxiosHttpService,
  OperationResult,
} from 'mvc-common-toolkit';
import { Repository } from 'typeorm';

import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';

import { ENV_KEY, INJECTION_TOKEN } from '@shared/constants';
import { BaseCRUDService } from '@shared/services/base-crud.service';

import { MLService } from '../ml/ml.service';
import { StockGroupMapping } from './stock-group-mapping.model';
import { StockGroup } from './stock-group.model';
import { ExchangeFilter, QueryStocksDTO } from './stocks.dto';
import { Stock } from './stocks.model';

@Injectable()
export class StocksService extends BaseCRUDService<Stock> {
  private readonly logger = new Logger(StocksService.name);

  constructor(
    @InjectRepository(Stock)
    protected repo: Repository<Stock>,

    @InjectRepository(StockGroup)
    protected groupRepo: Repository<StockGroup>,

    @InjectRepository(StockGroupMapping)
    protected mappingRepo: Repository<StockGroupMapping>,

    private readonly configService: ConfigService,

    @Inject(INJECTION_TOKEN.HTTP_SERVICE)
    protected readonly httpService: AxiosHttpService,

    @Inject(INJECTION_TOKEN.AUDIT_SERVICE)
    protected readonly auditService: AuditService,

    private readonly mlService: MLService,
  ) {
    super(repo);
  }

  protected get baseUrl(): string {
    return this.configService.getOrThrow<string>(ENV_KEY.ML_SERVICE_URL);
  }

  public async getStocks(query: QueryStocksDTO): Promise<OperationResult> {
    const filter: any = {};
    const relations: any = {};

    if (query.exchange && query.exchange !== ExchangeFilter.ALL) {
      filter.exchange = query.exchange;
    }

    if (query.group) {
      const g = query.group.toUpperCase();
      relations.mappings = { stockGroup: true };
      filter.mappings = {
        stockGroup: {
          code: g,
        },
      };
    }

    const keywordColumns: (keyof Stock)[] = ['symbol', 'name'];
    const result = await this.paginateByKeyword(
      query,
      keywordColumns,
      query.keyword,
      filter,
      { relations },
    );

    return {
      success: true,
      data: result,
    };
  }

  public async crawlAndSave(
    exchange: ExchangeFilter,
  ): Promise<OperationResult> {
    try {
      const response = await this.mlService.getSymbolsByExchange(exchange);

      if (!response.success || !response.data) {
        return {
          success: false,
          message: response.message || 'Failed to fetch symbols from FastAPI',
        };
      }

      const crawledItems = response.data;
      this.logger.log(
        `Fetched ${crawledItems.length} stocks. Upserting into DB...`,
      );

      const insertedCount = await this.upsertStocksInChunks(crawledItems);

      this.logger.log(
        `Successfully synced ${insertedCount} stocks into the database.`,
      );
      return {
        success: true,
        data: {
          total: crawledItems.length,
          synced: insertedCount,
        },
        message: 'Stocks crawl completed successfully',
      };
    } catch (error) {
      this.logger.error('Error in crawlAndSave:', error);
      return {
        success: false,
        message: `Stock crawl failed: ${error.message}`,
      };
    }
  }

  private async upsertStocksInChunks(
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

      // 2. Fetch all stocks and clear existing mappings
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

      const newMappings: StockGroupMapping[] = [];

      for (const stock of allStocks) {
        const sym = stock.symbol.toUpperCase();

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
          const mapping = new StockGroupMapping();
          mapping.stockSymbol = stock.symbol;
          mapping.groupId = groupMap.get(ex)!;
          newMappings.push(mapping);
        }

        // Map index groups
        let indexGroupCode: string | null = null;
        if (vn30Set.has(sym) && groupMap.has('VN30')) {
          const mapping = new StockGroupMapping();
          mapping.stockSymbol = stock.symbol;
          mapping.groupId = groupMap.get('VN30')!;
          newMappings.push(mapping);
          indexGroupCode = 'VN30';
        }
        if (cwSet.has(sym) && groupMap.has('CW')) {
          const mapping = new StockGroupMapping();
          mapping.stockSymbol = stock.symbol;
          mapping.groupId = groupMap.get('CW')!;
          newMappings.push(mapping);
          indexGroupCode = 'CW';
        }
        if (etfSet.has(sym) && groupMap.has('ETF')) {
          const mapping = new StockGroupMapping();
          mapping.stockSymbol = stock.symbol;
          mapping.groupId = groupMap.get('ETF')!;
          newMappings.push(mapping);
          indexGroupCode = 'ETF';
        }
        if (fuIndexSet.has(sym) && groupMap.has('FU_INDEX')) {
          const mapping = new StockGroupMapping();
          mapping.stockSymbol = stock.symbol;
          mapping.groupId = groupMap.get('FU_INDEX')!;
          newMappings.push(mapping);
          indexGroupCode = 'FU_INDEX';
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
        message: `Failed to sync stock classifications: ${error.message}`,
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
        message: `Failed to get classification summary: ${error.message}`,
      };
    }
  }
}
