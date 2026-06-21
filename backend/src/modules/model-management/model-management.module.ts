import { Module } from '@nestjs/common';

import { ModelManagementController } from './controllers/model-management.controller';
import { ModelManagementService } from './services/model-management.service';

@Module({
  controllers: [ModelManagementController],
  providers: [ModelManagementService],
  exports: [ModelManagementService],
})
export class ModelManagementModule {}
