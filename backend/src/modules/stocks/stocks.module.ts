import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MLModule } from '@modules/ml/ml.module';

import { StockCategoriesController } from './controllers/stock-categories.controller';
import { StocksController } from './controllers/stocks.controller';
import { IcbIndustry } from './entities/icb-industry.model';
import { StockGroupMapping } from './entities/stock-group-mapping.model';
import { StockGroup } from './entities/stock-group.model';
import { StockIcbMapping } from './entities/stock-icb-mapping.model';
import { StockPrice } from './entities/stock-price.model';
import { Stock } from './entities/stocks.model';
import { StockCategoriesService } from './services/stock-categories.service';
import { StocksClassificationSyncService } from './services/stocks-classification-sync.service';
import { StocksPriceSyncService } from './services/stocks-price-sync.service';
import { StocksSchedulerService } from './services/stocks-scheduler.service';
import { StocksService } from './services/stocks.service';

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
    StocksSchedulerService,
  ],
  exports: [
    StocksService,
    StockCategoriesService,
    StocksClassificationSyncService,
    StocksPriceSyncService,
    StocksSchedulerService,
  ],
})
export class StocksModule {}
