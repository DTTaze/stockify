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
import { getErrorMessage } from '@shared/helpers/common';
import { BaseCRUDService } from '@shared/services/base-crud.service';

import { MarketType, TimePeriod } from '@modules/ml/dto/ml.dto';
import { MLService } from '@modules/ml/services/ml.service';
import { StockPrice } from '../entities/stock-price.model';
import { StocksClassificationSyncService } from './stocks-classification-sync.service';
import { StocksPriceSyncService } from './stocks-price-sync.service';
import { ExchangeFilter, QueryStocksDTO } from '../dto/stocks.dto';
import { Stock } from '../entities/stocks.model';

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

      // Fetch dynamic VN30 list from ML and define index list
      const vn30Response = await this.mlService.getGroupedSymbols();
      const vn30Symbols = vn30Response.success && vn30Response.data?.VN30
        ? (vn30Response.data.VN30 as string[])
        : ['BID', 'CTG', 'FPT', 'HPG', 'SSI', 'TCB', 'VCB', 'VHM', 'VIC', 'VNM'];
      const indices = ['VNINDEX', 'VN30', 'HNXINDEX', 'UPCOMINDEX', 'HNX30', 'VNXALL'];
      const allowedSymbols = new Set([...vn30Symbols, ...indices].map((s) => s.toUpperCase()));

      const crawledItems = response.data.filter((item) =>
        allowedSymbols.has(item.symbol.toUpperCase()),
      );

      this.logger.log(
        `Fetched ${crawledItems.length} stocks matching allowed VN30/Index symbols. Upserting into DB...`,
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

      // Retrieve directly from database (avoiding live external fetch during user API calls)
      const prices = await this.priceRepo.find({
        where: { symbol: upperSymbol },
        order: { date: 'DESC' },
        take: 2,
      });

      if (!prices.length) {
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
}
