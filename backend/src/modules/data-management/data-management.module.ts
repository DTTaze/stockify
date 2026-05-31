import { Module } from '@nestjs/common';

import { StocksModule } from '../stocks/stocks.module';
import { DataManagementSchedulerService } from './data-management-scheduler.service';
import { DataManagementController } from './data-management.controller';
import { DataManagementService } from './data-management.service';

@Module({
  imports: [StocksModule],
  controllers: [DataManagementController],
  providers: [DataManagementService, DataManagementSchedulerService],
  exports: [DataManagementService],
})
export class DataManagementModule {}
