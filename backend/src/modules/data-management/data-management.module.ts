import { Module } from '@nestjs/common';

import { StocksModule } from '@modules/stocks/stocks.module';

import { DataManagementController } from './controllers/data-management.controller';
import { DataManagementSchedulerService } from './services/data-management-scheduler.service';
import { DataManagementService } from './services/data-management.service';

@Module({
  imports: [StocksModule],
  controllers: [DataManagementController],
  providers: [DataManagementService, DataManagementSchedulerService],
  exports: [DataManagementService],
})
export class DataManagementModule {}
