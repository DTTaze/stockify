import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { DataManagementService } from './data-management.service';

@Injectable()
export class DataManagementSchedulerService {
  private readonly logger = new Logger(DataManagementSchedulerService.name);

  constructor(private readonly dataManagementService: DataManagementService) {}

  // Run automatically at 17:00 (5:00 PM) everyday, after trading hours (9:00 - 15:00)
  @Cron('0 0 17 * * *')
  async handleAutoDailySync() {
    this.logger.log(
      'Triggering automated daily sync of stock price data & AI retraining...',
    );
    try {
      const result = await this.dataManagementService.updateAllStockData();
      if (result.success) {
        this.logger.log(`Daily stock sync completed: ${result.message}`);
      } else {
        this.logger.warn(`Daily stock sync warning: ${result.message}`);
      }
    } catch (error) {
      this.logger.error(
        'Critical error during automated daily stock sync:',
        error,
      );
    }
  }
}
