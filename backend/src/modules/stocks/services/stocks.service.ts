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

import { MarketType, TimePeriod } from '@modules/ml/dto/ml.dto';
import { MLService } from '@modules/ml/services/ml.service';

import { ENV_KEY, INJECTION_TOKEN } from '@shared/constants';
import { getErrorMessage } from '@shared/helpers/common';
import { BaseCRUDService } from '@shared/services/base-crud.service';

import { ExchangeFilter, QueryStocksDTO } from '../dto/stocks.dto';
import { StockPrice } from '../entities/stock-price.model';
import { Stock } from '../entities/stocks.model';
import { StocksClassificationSyncService } from './stocks-classification-sync.service';
import { StocksPriceSyncService } from './stocks-price-sync.service';

@Injectable()
export class StocksService extends BaseCRUDService<Stock> {
  private readonly logger = new Logger(StocksService.name);

  constructor(
    @InjectRepository(Stock)
    protected repo: Repository<Stock>,

    @InjectRepository(StockPrice)
    protected priceRepo: Repository<StockPrice>,

    private readonly configService: ConfigService,

    @Inject(INJECTION_TOKEN.HTTP_SERVICE)
    protected readonly httpService: AxiosHttpService,

    @Inject(INJECTION_TOKEN.AUDIT_SERVICE)
    protected readonly auditService: AuditService,

    private readonly mlService: MLService,

    private readonly classificationSyncService: StocksClassificationSyncService,
    private readonly priceSyncService: StocksPriceSyncService,
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

      // Fetch dynamic grouped symbols list from ML and define index list
      const groupedSymbolsResponse = await this.mlService.getGroupedSymbols();
      const groupedSymbols =
        groupedSymbolsResponse.success && groupedSymbolsResponse.data
          ? groupedSymbolsResponse.data
          : {};

      const allowedSymbols = new Set<string>();
      Object.keys(groupedSymbols).forEach((key) => {
        const symbols = groupedSymbols[key] || [];
        symbols.forEach((s: string) => allowedSymbols.add(s.toUpperCase()));
      });

      // Add default indices we want to keep
      const defaultIndices = [
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
      defaultIndices.forEach((s) => allowedSymbols.add(s.toUpperCase()));

      const crawledItems = response.data.filter((item) =>
        allowedSymbols.has(item.symbol.toUpperCase()),
      );

      this.logger.log(
        `Fetched ${crawledItems.length} stocks matching allowed symbols. Upserting into DB...`,
      );

      const insertedCount =
        await this.classificationSyncService.upsertStocksInChunks(crawledItems);

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
        message: `Stock crawl failed: ${getErrorMessage(error)}`,
      };
    }
  }

  public async syncClassifications(): Promise<OperationResult> {
    return this.classificationSyncService.syncClassifications();
  }

  public async getClassificationSummary(): Promise<OperationResult> {
    return this.classificationSyncService.getClassificationSummary();
  }

  public async saveHistoricalPrices(
    symbol: string,
    prices: Array<Record<string, unknown>>,
  ): Promise<OperationResult> {
    return this.priceSyncService.saveHistoricalPrices(symbol, prices);
  }

  public async syncTrainedStockPrices(): Promise<OperationResult> {
    return this.priceSyncService.syncTrainedStockPrices();
  }

  public async syncIndexPrices(): Promise<OperationResult> {
    return this.priceSyncService.syncIndexPrices();
  }

  public async syncGroupStockPrices(
    groupCode: string,
  ): Promise<OperationResult> {
    return this.priceSyncService.syncGroupStockPrices(groupCode);
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
      const upperSymbol = symbol.toUpperCase();

      // Retrieve up to 10 records from database to filter unique calendar days (timezone duplicate fallback)
      const prices = await this.priceRepo.find({
        where: { symbol: upperSymbol },
        order: { date: 'DESC' },
        take: 10,
      });

      // Filter to find the last 2 unique calendar dates in Vietnam timezone (UTC+7)
      const uniquePrices: StockPrice[] = [];
      const seenDates = new Set<string>();
      for (const p of prices) {
        if (!p.date) {
          continue;
        }

        // Add 7 hours to get Vietnam local date (UTC+7 has no DST offsets)
        const localDate = new Date(p.date.getTime() + 7 * 60 * 60 * 1000);
        const dateStr = localDate.toISOString().substring(0, 10);
        if (!seenDates.has(dateStr)) {
          seenDates.add(dateStr);
          uniquePrices.push(p);
        }
        if (uniquePrices.length >= 2) {
          break;
        }
      }

      this.logger.log(
        `[getStockQuote DEBUG] symbol: ${upperSymbol}, prices found: ${prices.length}, uniquePrices: ${uniquePrices.length}`,
      );
      if (uniquePrices.length >= 2) {
        this.logger.log(
          `[getStockQuote DEBUG] latest: ${uniquePrices[0].date.toISOString()} close ${uniquePrices[0].close}, previous: ${uniquePrices[1].date.toISOString()} close ${uniquePrices[1].close}`,
        );
      }

      if (!uniquePrices.length) {
        try {
          const mlQuoteResult = await this.mlService.getMarketQuote({
            symbol: upperSymbol,
            type: MarketType.STOCK,
            period: TimePeriod.ONE_DAY,
          });
          if (mlQuoteResult.success && mlQuoteResult.data) {
            return {
              success: true,
              data: {
                symbol: upperSymbol,
                price: mlQuoteResult.data.price ?? 0,
                change_percent: mlQuoteResult.data.change_percent ?? 0,
                volume: mlQuoteResult.data.volume ?? 0,
              },
            };
          }
        } catch (e) {
          this.logger.warn(
            `Failed to fetch fallback quote from ML for ${upperSymbol}: ${e.message}`,
          );
        }

        return {
          success: true,
          data: {
            symbol: upperSymbol,
            price: 0,
            change_percent: 0,
            volume: 0,
          },
        };
      }

      const latest = uniquePrices[0];
      const previous = uniquePrices[1];
      const close = latest.close ?? 0;

      let changePercent = 0;
      if (uniquePrices.length >= 2 && previous) {
        const previousClose = previous.close ?? close;
        changePercent = previousClose
          ? Number((((close - previousClose) / previousClose) * 100).toFixed(2))
          : 0;
      } else {
        // If only 1 unique price record exists, fallback to ML quote to get correct change percentage
        try {
          const mlQuoteResult = await this.mlService.getMarketQuote({
            symbol: upperSymbol,
            type: MarketType.STOCK,
            period: TimePeriod.ONE_DAY,
          });
          if (mlQuoteResult.success && mlQuoteResult.data) {
            changePercent = mlQuoteResult.data.change_percent ?? 0;
          }
        } catch (e) {
          this.logger.warn(
            `Failed to fetch fallback quote change from ML for ${upperSymbol}: ${e.message}`,
          );
        }
      }

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
        message: `Failed to get stock quote: ${getErrorMessage(error)}`,
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
        message: `Failed to get latest price date: ${getErrorMessage(error)}`,
      };
    }
  }

  private async buildHistoricalQuery(
    symbol: string,
    period?: TimePeriod,
    start?: string,
    end?: string,
  ) {
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

    return queryBuilder;
  }

  private async fetchAndSaveHistoricalPricesFromMl(
    symbol: string,
    period?: TimePeriod,
  ): Promise<Array<Record<string, unknown>>> {
    const mlHistory = await this.mlService.getMarketHistory({
      symbol,
      type: MarketType.STOCK,
      period: period || TimePeriod.ONE_MONTH,
    });

    if (!mlHistory.success || !mlHistory.data) {
      return [];
    }

    const historyData = mlHistory.data;
    const prices = Array.isArray(historyData)
      ? (historyData as Array<Record<string, unknown>>)
      : Array.isArray((historyData as any)?.data)
        ? ((historyData as any).data as Array<Record<string, unknown>>)
        : [];

    if (prices.length) {
      this.saveHistoricalPrices(symbol, prices).catch((err) => {
        this.logger.error(
          `Error background-saving historical prices for ${symbol}:`,
          err,
        );
      });
    }

    return prices;
  }

  public async getHistoricalPrices(
    symbol: string,
    period?: TimePeriod,
    start?: string,
    end?: string,
  ): Promise<OperationResult<Array<Record<string, unknown>>>> {
    try {
      const upperSymbol = symbol.toUpperCase();

      // Retrieve directly from database (avoiding live external fetch during user API calls)
      const queryBuilder = await this.buildHistoricalQuery(
        symbol,
        period,
        start,
        end,
      );
      const list = await queryBuilder.getMany();

      if (list.length === 0) {
        this.logger.log(
          `No historical prices in DB for ${upperSymbol}. Fetching from ML...`,
        );
        const mlPrices = await this.fetchAndSaveHistoricalPricesFromMl(
          upperSymbol,
          period,
        );
        if (mlPrices.length > 0) {
          return {
            success: true,
            data: mlPrices.map((item: any) => ({
              date: new Date(item.date).toISOString(),
              close: Number(item.close),
              volume: Number(item.volume),
            })),
          };
        }
      }

      // Deduplicate by calendar date in Vietnam timezone (UTC+7) to handle legacy duplicate data
      const uniqueList: typeof list = [];
      const seenDates = new Set<string>();
      for (const item of list) {
        if (!item.date) {
          continue;
        }
        const localDate = new Date(item.date.getTime() + 7 * 60 * 60 * 1000);
        const dateStr = localDate.toISOString().substring(0, 10);
        if (!seenDates.has(dateStr)) {
          seenDates.add(dateStr);
          uniqueList.push(item);
        }
      }

      return {
        success: true,
        data: uniqueList.map((item) => ({
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
        message: `Failed to get historical prices: ${getErrorMessage(error)}`,
      };
    }
  }

  public async getHistoricalByPeriod(
    symbol: string,
    period: string,
  ): Promise<OperationResult> {
    try {
      const result = await this.getHistoricalPrices(
        symbol,
        period as TimePeriod,
      );
      if (!result.success || !result.data) {
        return result;
      }
      return {
        success: true,
        data: result.data.map((p: any) => ({
          date: new Date(p.date),
          close: p.close,
          volume: p.volume,
        })),
      };
    } catch (error) {
      this.logger.error(`Error in getHistoricalByPeriod for ${symbol}:`, error);
      return {
        success: false,
        message: `Failed to get historical prices: ${error.message}`,
      };
    }
  }

  public async getStockStats(
    symbols: string[],
  ): Promise<
    Record<string, { totalRecords: number; lastUpdated: Date | null }>
  > {
    if (!symbols || !symbols.length) {
      return {};
    }
    const stats = await this.priceRepo
      .createQueryBuilder('sp')
      .select('sp.symbol', 'symbol')
      .addSelect('COUNT(*)', 'totalRecords')
      .addSelect('MAX(sp.date)', 'lastUpdated')
      .where('sp.symbol IN (:...symbols)', { symbols })
      .groupBy('sp.symbol')
      .getRawMany();

    const result: Record<
      string,
      { totalRecords: number; lastUpdated: Date | null }
    > = {};
    for (const item of stats) {
      result[item.symbol] = {
        totalRecords: parseInt(item.totalRecords, 10) || 0,
        lastUpdated: item.lastUpdated ? new Date(item.lastUpdated) : null,
      };
    }
    return result;
  }

  public async getDataSummary(): Promise<{
    totalStocks: number;
    updated: number;
    needsUpdate: number;
    totalRecords: number;
  }> {
    const totalStocks = await this.repo.count();
    const totalRecords = await this.priceRepo.count();

    const distinctSymbolsResult = await this.priceRepo
      .createQueryBuilder('sp')
      .select('DISTINCT sp.symbol', 'symbol')
      .getRawMany();
    const updated = distinctSymbolsResult.length;
    const needsUpdate = Math.max(0, totalStocks - updated);

    return {
      totalStocks,
      updated,
      needsUpdate,
      totalRecords,
    };
  }
}
