import { OperationResult } from 'mvc-common-toolkit';
import { Repository } from 'typeorm';

import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { MarketType, TimePeriod } from '@modules/ml/dto/ml.dto';
import { MLService } from '@modules/ml/services/ml.service';

import { getErrorMessage } from '@shared/helpers/common';

import { StockPrice } from '../entities/stock-price.model';
import { Stock } from '../entities/stocks.model';

@Injectable()
export class StocksPriceSyncService {
  private readonly logger = new Logger(StocksPriceSyncService.name);

  constructor(
    @InjectRepository(Stock)
    private readonly repo: Repository<Stock>,

    @InjectRepository(StockPrice)
    private readonly priceRepo: Repository<StockPrice>,

    private readonly mlService: MLService,
  ) {}

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

        // Normalize date to UTC midnight of the calendar date to prevent timezone duplicates
        const dateStr = String(dateValue).substring(0, 10);
        sp.date = new Date(`${dateStr}T00:00:00.000Z`);

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
        message: `Failed to save historical prices: ${getErrorMessage(error)}`,
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

      const symbols = supportedSymbols.data.symbols;
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
        message: `Failed to sync trained stock prices: ${getErrorMessage(error)}`,
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
        message: `Failed to sync index prices: ${getErrorMessage(error)}`,
      };
    }
  }

  public async syncGroupStockPrices(
    groupCode: string,
  ): Promise<OperationResult> {
    try {
      const upperGroupCode = groupCode.toUpperCase();
      this.logger.log(`Fetching stock symbols for group ${upperGroupCode}...`);

      const stocks = await this.repo.find({
        where: {
          mappings: {
            stockGroup: {
              code: upperGroupCode,
            },
          },
        },
        relations: ['mappings', 'mappings.stockGroup'],
      });

      if (!stocks.length) {
        return {
          success: false,
          message: `No stock symbols found for group ${upperGroupCode} in the database.`,
        };
      }

      const symbols = stocks.map((s) => s.symbol);
      this.logger.log(
        `Found ${symbols.length} symbols for group ${upperGroupCode}. Starting price sync...`,
      );

      let syncedRecords = 0;
      const failedSymbols: string[] = [];

      for (const symbol of symbols) {
        this.logger.log(`Syncing prices for ${symbol}...`);

        // Wait 1 second between symbols to prevent rate-limiting from VCI/KBS data sources
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const historyResult = await this.retryOperation<unknown>(() =>
          this.mlService.getMarketHistory({
            symbol,
            type: MarketType.STOCK,
            period: TimePeriod.ONE_YEAR,
          }),
        );

        if (!historyResult.success || !historyResult.data) {
          this.logger.warn(
            `Failed to fetch history for ${symbol}: ${historyResult.message}`,
          );
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
          this.logger.warn(`No prices returned for ${symbol}`);
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

      return {
        success: true,
        data: {
          groupCode: upperGroupCode,
          totalSymbols: symbols.length,
          syncedRecords,
          failedSymbols,
        },
        message: `Synced ${syncedRecords} price records for group ${upperGroupCode} (${
          symbols.length - failedSymbols.length
        }/${symbols.length} succeeded)`,
      };
    } catch (error) {
      this.logger.error(
        `Error syncing group ${groupCode} stock prices:`,
        error,
      );
      return {
        success: false,
        message: `Failed to sync group ${groupCode} stock prices: ${getErrorMessage(
          error,
        )}`,
      };
    }
  }
}
