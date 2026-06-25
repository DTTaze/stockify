import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { StocksService } from '@modules/stocks/services/stocks.service';

import { DataManagementService } from './data-management.service';

@Injectable()
export class DataManagementSchedulerService {
  private readonly logger = new Logger(DataManagementSchedulerService.name);

  constructor(
    private readonly dataManagementService: DataManagementService,
    private readonly stocksService: StocksService,
  ) {}

  // Run automatically at 17:30 (5:30 PM) everyday, after trading closes and closing prices are finalized
  @Cron('0 30 17 * * *')
  async handleAutoDailySync() {
    this.logger.log(
      'Triggering automated daily sync of stock price data & AI retraining...',
    );
    try {
      // 1. First sync trained stock prices to update the database
      this.logger.log('Syncing trained stock prices...');
      const syncResult = await this.stocksService.syncTrainedStockPrices();
      if (syncResult.success) {
        this.logger.log(`Stock price sync completed: ${syncResult.message}`);
      } else {
        this.logger.warn(`Stock price sync warning: ${syncResult.message}`);
      }

      // 2. Sync index prices
      this.logger.log('Syncing market indices...');
      const indexResult = await this.stocksService.syncIndexPrices();
      if (indexResult.success) {
        this.logger.log(`Index sync completed: ${indexResult.message}`);
      } else {
        this.logger.warn(`Index sync warning: ${indexResult.message}`);
      }

      // 3. Trigger model retraining with the newest data
      this.logger.log('Triggering automated AI model retraining...');
      const result = await this.dataManagementService.updateAllStockData();
      if (result.success) {
        this.logger.log(`AI model retraining started: ${result.message}`);
      } else {
        this.logger.warn(`AI model retraining warning: ${result.message}`);
      }
    } catch (error) {
      this.logger.error(
        'Critical error during automated daily stock sync and AI retraining:',
        error,
      );
    }
  }
}
