import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { StocksService } from './stocks.service';

@Injectable()
export class StocksSchedulerService {
  private readonly logger = new Logger(StocksSchedulerService.name);

  constructor(private readonly stocksService: StocksService) {}

  // Run automatically every 30 minutes to pull latest stocks/index prices
  @Cron('0 */30 * * * *')
  async handleAutoPriceSync() {
    this.logger.log(
      'Triggering automated interval sync of stock price data & market indices...',
    );
    try {
      const result = await this.stocksService.syncTrainedStockPrices();
      if (result.success) {
        this.logger.log(`Stock and index sync completed: ${result.message}`);
      } else {
        this.logger.warn(`Stock and index sync warning: ${result.message}`);
      }
    } catch (error) {
      this.logger.error('Critical error during automated stock sync:', error);
    }
  }
}
