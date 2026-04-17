import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StockCompaniesController } from './stock-companies.controller';
import { StockCompanies } from './stock-companies.model';
import { StockCompaniesService } from './stock-companies.service';

@Module({
  imports: [TypeOrmModule.forFeature([StockCompanies])],
  controllers: [StockCompaniesController],
  providers: [StockCompaniesService],
  exports: [StockCompaniesService],
})
export class StockCompaniesModule {}
