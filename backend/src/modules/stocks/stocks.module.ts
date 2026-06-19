import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MLModule } from '../ml/ml.module';
import { IcbIndustry } from './icb-industry.model';
import { StockCategoriesController } from './stock-categories.controller';
import { StockCategoriesService } from './stock-categories.service';
import { StockGroupMapping } from './stock-group-mapping.model';
import { StockGroup } from './stock-group.model';
import { StockIcbMapping } from './stock-icb-mapping.model';
import { StockPrice } from './stock-price.model';
import { StocksClassificationSyncService } from './stocks-classification-sync.service';
import { StocksPriceSyncService } from './stocks-price-sync.service';
import { StocksController } from './stocks.controller';
import { Stock } from './stocks.model';
import { StocksService } from './stocks.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Stock,
      StockGroup,
      StockGroupMapping,
      IcbIndustry,
      StockIcbMapping,
      StockPrice,
    ]),
    MLModule,
  ],
  controllers: [StocksController, StockCategoriesController],
  providers: [
    StocksService,
    StockCategoriesService,
    StocksClassificationSyncService,
    StocksPriceSyncService,
  ],
  exports: [
    StocksService,
    StockCategoriesService,
    StocksClassificationSyncService,
    StocksPriceSyncService,
  ],
})
export class StocksModule {}
