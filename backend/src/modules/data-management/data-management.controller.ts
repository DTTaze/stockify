import { HttpResponse } from 'mvc-common-toolkit';

import { Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { DataManagementService } from './data-management.service';

@ApiTags('Data Management')
@ApiBearerAuth()
@Controller('data-management')
export class DataManagementController {
  constructor(protected dataManagementService: DataManagementService) {}

  @Get('summary')
  @ApiOperation({
    summary: 'Get data management summary',
    description: 'Get dashboard statistics for ML processed stock data',
  })
  async getDataManagementSummary(): Promise<HttpResponse> {
    return this.dataManagementService.getDataManagementSummary();
  }

  @Get('stocks')
  @ApiOperation({
    summary: 'Get data management stock list',
    description: 'Get list of stock symbols and processed data status',
  })
  async getDataManagementStocks(): Promise<HttpResponse> {
    return this.dataManagementService.getDataManagementStocks();
  }

  @Post('update/:symbol')
  @ApiOperation({
    summary: 'Update data for a single symbol',
    description: 'Refresh data processing for a specific stock symbol',
  })
  async updateStockData(
    @Param('symbol') symbol: string,
  ): Promise<HttpResponse> {
    return this.dataManagementService.updateStockData(symbol);
  }

  @Post('update-all')
  @ApiOperation({
    summary: 'Update data for all symbols',
    description: 'Refresh data processing for all supported stock symbols',
  })
  async updateAllStockData(): Promise<HttpResponse> {
    return this.dataManagementService.updateAllStockData();
  }
}
