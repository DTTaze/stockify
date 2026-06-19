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
import { StockPrice } from './stock-price.model';
import { ExchangeFilter, QueryStocksDTO } from './stocks.dto';
import { Stock } from './stocks.model';
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

      const insertedCount = await this.classificationSyncService.upsertStocksInChunks(
        crawledItems,
      );

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
      const prices = await this.priceRepo.find({
        where: { symbol: upperSymbol },
        order: { date: 'DESC' },
        take: 2,
      });

      if (!prices.length) {
        try {
          const mlQuote = await this.mlService.getMarketQuote({
            symbol: upperSymbol,
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

  public async getHistoricalByPeriod(
    symbol: string,
    period: string,
  ): Promise<OperationResult> {
    try {
      const startDate = this.getPeriodStartDate(period as TimePeriod);
      const upperSymbol = symbol.toUpperCase();

      const list = await this.priceRepo
        .createQueryBuilder('sp')
        .where('sp.symbol = :symbol', { symbol: upperSymbol })
        .andWhere('sp.date >= :start', { start: startDate })
        .orderBy('sp.date', 'ASC')
        .getMany();

      const data = list.map((p) => ({
        date: p.date,
        close: p.close,
        volume: Number(p.volume),
      }));

      return { success: true, data };
    } catch (error) {
      this.logger.error(`Error in getHistoricalByPeriod for ${symbol}:`, error);
      return {
        success: false,
        message: `Failed to get historical prices: ${error.message}`,
      };
    }
  }
}
