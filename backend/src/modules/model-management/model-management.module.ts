import { Module } from '@nestjs/common';

import { ModelManagementController } from './model-management.controller';
import { ModelManagementService } from './model-management.service';

@Module({
  controllers: [ModelManagementController],
  providers: [ModelManagementService],
  exports: [ModelManagementService],
})
export class ModelManagementModule {}
