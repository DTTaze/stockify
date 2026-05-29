import { HttpResponse } from 'mvc-common-toolkit';

import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { StockCompaniesService } from './stock-companies.service';

@ApiTags('Stock Companies')
@ApiBearerAuth()
@Controller('stock-companies')
export class StockCompaniesController {
  constructor(protected stockCompaniesService: StockCompaniesService) {}

  @Get()
  async getAll(): Promise<HttpResponse> {
    return this.stockCompaniesService.getAll();
  }
}
