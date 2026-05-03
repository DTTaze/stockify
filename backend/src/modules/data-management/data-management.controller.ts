import { HttpResponse } from 'mvc-common-toolkit';

import { Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { generateInternalServerResult } from '@shared/helpers/operation-result.helper';

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
    const result = await this.dataManagementService.getDataManagementSummary();

    if (!result.success) {
      return generateInternalServerResult(result.message);
    }

    return {
      success: true,
      data: result.data,
    };
  }

  @Get('stocks')
  @ApiOperation({
    summary: 'Get data management stock list',
    description: 'Get list of stock symbols and processed data status',
  })
  async getDataManagementStocks(): Promise<HttpResponse> {
    const result = await this.dataManagementService.getDataManagementStocks();

    if (!result.success) {
      return generateInternalServerResult(result.message);
    }

    return {
      success: true,
      data: result.data,
    };
  }

  @Post('update/:symbol')
  @ApiOperation({
    summary: 'Update data for a single symbol',
    description: 'Refresh data processing for a specific stock symbol',
  })
  async updateStockData(
    @Param('symbol') symbol: string,
  ): Promise<HttpResponse> {
    const result = await this.dataManagementService.updateStockData(symbol);

    if (!result.success) {
      return generateInternalServerResult(result.message);
    }

    return {
      success: true,
      data: result.data,
    };
  }

  @Post('update-all')
  @ApiOperation({
    summary: 'Update data for all symbols',
    description: 'Refresh data processing for all supported stock symbols',
  })
  async updateAllStockData(): Promise<HttpResponse> {
    const result = await this.dataManagementService.updateAllStockData();

    if (!result.success) {
      return generateInternalServerResult(result.message);
    }

    return {
      success: true,
      data: result.data,
    };
  }
}
