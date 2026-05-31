import { Module } from '@nestjs/common';

import { DataManagementSchedulerService } from './data-management-scheduler.service';
import { DataManagementController } from './data-management.controller';
import { DataManagementService } from './data-management.service';

@Module({
  controllers: [DataManagementController],
  providers: [DataManagementService, DataManagementSchedulerService],
  exports: [DataManagementService],
})
export class DataManagementModule {}
