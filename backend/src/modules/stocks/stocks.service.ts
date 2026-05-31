import * as dayjs from 'dayjs';
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

import { MarketType, TimePeriod } from '../ml/ml.dto';
import { MLService } from '../ml/ml.service';
import { StockGroupMapping } from './stock-group-mapping.model';
import { StockGroup } from './stock-group.model';
import { StockPrice } from './stock-price.model';
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

    @InjectRepository(StockPrice)
    protected priceRepo: Repository<StockPrice>,

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

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }

    if (typeof error === 'string') {
      return error;
    }

    try {
      return JSON.stringify(error);
    } catch {
      return 'Unknown error';
    }
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
        message: `Stock crawl failed: ${this.getErrorMessage(error)}`,
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
        message: `Failed to sync stock classifications: ${this.getErrorMessage(error)}`,
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
        message: `Failed to get classification summary: ${this.getErrorMessage(error)}`,
      };
    }
  }

  public async saveHistoricalPrices(
    symbol: string,
    prices: Array<Record<string, unknown>>,
  ): Promise<OperationResult> {
    try {
      this.logger.log(`Saving ${prices.length} stock prices for ${symbol}...`);
      const entities = prices.map((p) => {
        const sp = new StockPrice();
        const dateValue = p.date ?? p.time ?? '';
        sp.symbol = symbol.toUpperCase();
        sp.date = new Date(String(dateValue));
        sp.open = Number(p.open ?? p.Open ?? 0);
        sp.high = Number(p.high ?? p.High ?? 0);
        sp.low = Number(p.low ?? p.Low ?? 0);
        sp.close = Number(p.close ?? p.Close ?? 0);
        sp.volume = Number(p.volume ?? p.Volume ?? 0);
        return sp;
      });

      // Upsert in chunks
      const chunkSize = 200;
      for (let i = 0; i < entities.length; i += chunkSize) {
        const chunk = entities.slice(i, i + chunkSize);
        await this.priceRepo.upsert(chunk, ['symbol', 'date']);
      }

      return {
        success: true,
        message: `Successfully saved ${prices.length} historical prices for ${symbol}`,
      };
    } catch (error) {
      this.logger.error(`Error saving historical prices for ${symbol}:`, error);
      return {
        success: false,
        message: `Failed to save historical prices: ${this.getErrorMessage(error)}`,
      };
    }
  }

  private async retryOperation<T>(
    operation: () => Promise<OperationResult<T>>,
    retries = 3,
    delayMs = 500,
  ): Promise<OperationResult<T>> {
    let attempt = 0;

    while (attempt < retries) {
      const result = await operation();
      if (result.success) {
        return result;
      }

      attempt += 1;
      this.logger.warn(
        `Retry attempt ${attempt} failed: ${result.message || 'unknown error'}`,
      );
      await new Promise((resolve) => setTimeout(resolve, delayMs * attempt));
    }

    return {
      success: false,
      message: `Failed after ${retries} retries`,
    };
  }

  public async syncTrainedStockPrices(): Promise<OperationResult> {
    try {
      const supportedSymbols = await this.mlService.getSupportedSymbols();

      if (
        !supportedSymbols.success ||
        !supportedSymbols.data?.symbols?.length
      ) {
        return {
          success: false,
          message:
            supportedSymbols.message ||
            'Failed to retrieve trained stock symbols from ML service',
        };
      }

      const symbols = supportedSymbols.data.symbols.slice(0, 10);
      let syncedRecords = 0;
      const failedSymbols: string[] = [];

      for (const symbol of symbols) {
        const historyResult = await this.retryOperation<unknown>(() =>
          this.mlService.getMarketHistory({
            symbol,
            type: MarketType.STOCK,
            period: TimePeriod.ONE_YEAR,
          }),
        );

        if (!historyResult.success || !historyResult.data) {
          failedSymbols.push(symbol);
          continue;
        }

        const historyData = historyResult.data;
        const prices = Array.isArray(historyData)
          ? (historyData as Array<Record<string, unknown>>)
          : Array.isArray((historyData as { data?: unknown }).data)
            ? ((historyData as { data: unknown }).data as Array<
                Record<string, unknown>
              >)
            : [];

        if (!prices.length) {
          failedSymbols.push(symbol);
          continue;
        }

        const saveResult = await this.saveHistoricalPrices(symbol, prices);
        if (!saveResult.success) {
          failedSymbols.push(symbol);
          continue;
        }

        syncedRecords += prices.length;
      }

      // Also sync indices
      const indexResult = await this.syncIndexPrices();

      return {
        success: true,
        data: {
          totalSymbols: symbols.length,
          syncedRecords,
          failedSymbols,
          indicesSync: indexResult.data,
        },
        message: `Synced ${syncedRecords} price records for ${symbols.length} trained symbols. Indices: ${indexResult.message}`,
      };
    } catch (error) {
      this.logger.error('Error syncing trained stock prices:', error);
      return {
        success: false,
        message: `Failed to sync trained stock prices: ${this.getErrorMessage(error)}`,
      };
    }
  }

  public async syncIndexPrices(): Promise<OperationResult> {
    try {
      const indices = ['VNINDEX', 'VN30', 'HNXINDEX', 'UPCOMINDEX'];
      let syncedRecords = 0;
      const failedIndices: string[] = [];

      for (const symbol of indices) {
        // Ensure the index stock exists in the stocks table first
        let stock = await this.repo.findOne({ where: { symbol } });
        if (!stock) {
          stock = this.repo.create({
            symbol,
            exchange: 'INDEX',
            name: 'Chỉ số ' + symbol,
            type: 'index',
          });
          await this.repo.save(stock);
        }

        const historyResult = await this.retryOperation<unknown>(() =>
          this.mlService.getMarketHistory({
            symbol,
            type: MarketType.STOCK,
            period: TimePeriod.ONE_YEAR,
          }),
        );

        if (!historyResult.success || !historyResult.data) {
          this.logger.warn(
            `Failed to fetch index history from ML for ${symbol}: ${historyResult.message}`,
          );
          failedIndices.push(symbol);
          continue;
        }

        const historyData = historyResult.data;
        const prices = Array.isArray(historyData)
          ? (historyData as Array<Record<string, unknown>>)
          : Array.isArray((historyData as { data?: unknown }).data)
            ? ((historyData as { data: unknown }).data as Array<
                Record<string, unknown>
              >)
            : [];

        if (!prices.length) {
          this.logger.warn(`No price points parsed for index ${symbol}`);
          failedIndices.push(symbol);
          continue;
        }

        const saveResult = await this.saveHistoricalPrices(symbol, prices);
        if (!saveResult.success) {
          failedIndices.push(symbol);
          continue;
        }

        syncedRecords += prices.length;
      }

      return {
        success: true,
        data: {
          totalIndices: indices.length,
          syncedRecords,
          failedIndices,
        },
        message: `Synced ${syncedRecords} price records for ${indices.length} indices`,
      };
    } catch (error) {
      this.logger.error('Error syncing index prices:', error);
      return {
        success: false,
        message: `Failed to sync index prices: ${this.getErrorMessage(error)}`,
      };
    }
  }

  public async getStockQuote(symbol: string): Promise<
    OperationResult<{
      symbol: string;
      price: number;
      change_percent: number;
      volume: number;
    }>
  > {
    try {
      const prices = await this.priceRepo.find({
        where: { symbol: symbol.toUpperCase() },
        order: { date: 'DESC' },
        take: 2,
      });

      if (!prices.length) {
        try {
          const mlQuote = await this.mlService.getMarketQuote({
            symbol,
            type: MarketType.STOCK,
            period: TimePeriod.ONE_DAY,
          });

          if (mlQuote.success && mlQuote.data) {
            return {
              success: true,
              data: {
                symbol: mlQuote.data.symbol,
                price: mlQuote.data.price,
                change_percent: mlQuote.data.change_percent,
                volume: mlQuote.data.volume ?? 0,
              },
            };
          }
        } catch (err) {
          this.logger.error(
            `Error falling back to ML service for ${symbol}:`,
            err,
          );
        }

        return {
          success: false,
          message: `No historical price data found for symbol ${symbol}`,
        };
      }

      const latest = prices[0];
      const previous = prices[1];
      const close = latest.close ?? 0;
      const previousClose = previous?.close ?? close;
      const changePercent = previousClose
        ? Number((((close - previousClose) / previousClose) * 100).toFixed(2))
        : 0;

      return {
        success: true,
        data: {
          symbol: latest.symbol,
          price: close,
          change_percent: changePercent,
          volume: latest.volume ?? 0,
        },
      };
    } catch (error) {
      this.logger.error(`Error getting stock quote for ${symbol}:`, error);
      return {
        success: false,
        message: `Failed to get stock quote: ${this.getErrorMessage(error)}`,
      };
    }
  }

  private getPeriodStartDate(
    period: TimePeriod,
    relativeTo: Date = new Date(),
  ): Date {
    const base = dayjs(relativeTo);
    switch (period) {
      case TimePeriod.ONE_DAY:
        return base.subtract(1, 'day').toDate();
      case TimePeriod.ONE_WEEK:
        return base.subtract(1, 'week').toDate();
      case TimePeriod.ONE_MONTH:
        return base.subtract(1, 'month').toDate();
      case TimePeriod.THREE_MONTH:
        return base.subtract(3, 'month').toDate();
      case TimePeriod.SIX_MONTH:
        return base.subtract(6, 'month').toDate();
      case TimePeriod.ONE_YEAR:
        return base.subtract(1, 'year').toDate();
      default:
        return base.subtract(1, 'month').toDate();
    }
  }

  public async getLatestPriceDate(
    symbol: string,
  ): Promise<OperationResult<string | null>> {
    try {
      const latest = await this.priceRepo.findOne({
        where: { symbol: symbol.toUpperCase() },
        order: { date: 'DESC' },
      });

      return {
        success: true,
        data: latest ? latest.date.toISOString() : null,
      };
    } catch (error) {
      this.logger.error(
        `Error getting latest price date for ${symbol}:`,
        error,
      );
      return {
        success: false,
        message: `Failed to get latest price date: ${this.getErrorMessage(error)}`,
      };
    }
  }

  public async getHistoricalPrices(
    symbol: string,
    period?: TimePeriod,
    start?: string,
    end?: string,
  ): Promise<OperationResult<Array<Record<string, unknown>>>> {
    try {
      let relativeTo = new Date();
      if (!start && !end) {
        const latestPrice = await this.priceRepo.findOne({
          where: { symbol: symbol.toUpperCase() },
          order: { date: 'DESC' },
        });
        if (latestPrice) {
          relativeTo = latestPrice.date;
        }
      }

      const queryBuilder = this.priceRepo
        .createQueryBuilder('sp')
        .where('sp.symbol = :symbol', { symbol: symbol.toUpperCase() })
        .orderBy('sp.date', 'ASC');

      if (start) {
        queryBuilder.andWhere('sp.date >= :start', { start: new Date(start) });
      } else if (period) {
        if (period === TimePeriod.ONE_DAY) {
          const subQuery = this.priceRepo
            .createQueryBuilder('sub')
            .select('sub.date', 'date')
            .where('sub.symbol = :symbol', { symbol: symbol.toUpperCase() })
            .orderBy('sub.date', 'DESC')
            .limit(2);

          const recentDates = await subQuery.getRawMany();
          if (recentDates.length > 0) {
            const minRecentDate = recentDates[recentDates.length - 1].date;
            queryBuilder.andWhere('sp.date >= :start', {
              start: minRecentDate,
            });
          } else {
            queryBuilder.andWhere('sp.date >= :start', {
              start: this.getPeriodStartDate(period, relativeTo),
            });
          }
        } else {
          queryBuilder.andWhere('sp.date >= :start', {
            start: this.getPeriodStartDate(period, relativeTo),
          });
        }
      }

      if (end) {
        queryBuilder.andWhere('sp.date <= :end', { end: new Date(end) });
      }

      const list = await queryBuilder.getMany();

      // If no data in DB for this query, fall back to ML Service
      if (!list.length) {
        this.logger.log(
          `No historical data in DB for ${symbol}. Falling back to ML service...`,
        );
        const mlHistory = await this.mlService.getMarketHistory({
          symbol,
          type: MarketType.STOCK,
          period: period || TimePeriod.ONE_MONTH,
        });

        if (mlHistory.success && mlHistory.data) {
          const historyData = mlHistory.data;
          const prices = Array.isArray(historyData)
            ? (historyData as Array<Record<string, unknown>>)
            : Array.isArray((historyData as any)?.data)
              ? ((historyData as any).data as Array<Record<string, unknown>>)
              : [];

          if (prices.length) {
            // Save to DB in background (don't block the request)
            this.saveHistoricalPrices(symbol, prices).catch((err) => {
              this.logger.error(
                `Error background-saving historical prices for ${symbol}:`,
                err,
              );
            });

            return {
              success: true,
              data: prices.map((p) => {
                const dateValue = p.date ?? p.time ?? '';
                return {
                  date: new Date(String(dateValue)).toISOString(),
                  close: Number(p.close ?? p.Close ?? 0),
                  volume: Number(p.volume ?? p.Volume ?? 0),
                };
              }),
            };
          }
        }
      }

      return {
        success: true,
        data: list.map((item) => ({
          date: item.date.toISOString(),
          close: item.close,
          volume: item.volume,
        })),
      };
    } catch (error) {
      this.logger.error(
        `Error getting historical prices for ${symbol}:`,
        error,
      );
      return {
        success: false,
        message: `Failed to get historical prices: ${this.getErrorMessage(error)}`,
      };
    }
  }
}
