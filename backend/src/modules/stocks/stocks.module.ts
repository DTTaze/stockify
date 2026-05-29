import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MLModule } from '../ml/ml.module';
import { StocksController } from './stocks.controller';
import { Stock } from './stocks.model';
import { StocksService } from './stocks.service';

@Module({
  imports: [TypeOrmModule.forFeature([Stock]), MLModule],
  controllers: [StocksController],
  providers: [StocksService],
  exports: [StocksService],
})
export class StocksModule {}
