import { Module } from '@nestjs/common';

import { MLController } from './controllers/ml.controller';
import { MLService } from './services/ml.service';

@Module({
  controllers: [MLController],
  providers: [MLService],
  exports: [MLService],
})
export class MLModule {}
