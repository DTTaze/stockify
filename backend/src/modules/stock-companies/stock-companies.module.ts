import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StockCompaniesController } from './controllers/stock-companies.controller';
import { StockCompanies } from './entities/stock-companies.model';
import { StockCompaniesService } from './services/stock-companies.service';

@Module({
  imports: [TypeOrmModule.forFeature([StockCompanies])],
  controllers: [StockCompaniesController],
  providers: [StockCompaniesService],
  exports: [StockCompaniesService],
})
export class StockCompaniesModule {}
