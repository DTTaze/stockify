import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MLModule } from '../ml/ml.module';
import { StockGroupMapping } from './stock-group-mapping.model';
import { StockGroup } from './stock-group.model';
import { StocksController } from './stocks.controller';
import { Stock } from './stocks.model';
import { StocksService } from './stocks.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Stock, StockGroup, StockGroupMapping]),
    MLModule,
  ],
  controllers: [StocksController],
  providers: [StocksService],
  exports: [StocksService],
})
export class StocksModule {}
