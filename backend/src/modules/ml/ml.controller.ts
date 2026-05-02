import { HttpResponse } from 'mvc-common-toolkit';

import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { generateInternalServerResult } from '@shared/helpers/operation-result.helper';

import { MarketQuoteDto, PredictionDto, SupportedSymbolsDto } from './ml.dto';
import { MLService } from './ml.service';

@ApiTags('ML')
@ApiBearerAuth()
@Controller('ml')
export class MLController {
  constructor(private readonly mlService: MLService) {}

  @Get('market/quote')
  @ApiOperation({
    summary: 'Get current market quote',
    description: 'Retrieve current price and statistics for a given symbol',
  })
  async getMarketQuote(@Query() query: MarketQuoteDto): Promise<HttpResponse> {
    const result = await this.mlService.getMarketQuote(query);

    if (!result.success) {
      return generateInternalServerResult(result.message);
    }

    return {
      success: true,
      data: result.data,
    };
  }

  @Get('market/history')
  @ApiOperation({
    summary: 'Get market quote history',
    description: 'Retrieve historical price data for a given symbol',
  })
  async getMarketHistory(
    @Query() query: MarketQuoteDto,
  ): Promise<HttpResponse> {
    const result = await this.mlService.getMarketHistory(query);

    if (!result.success) {
      return generateInternalServerResult(result.message);
    }

    return {
      success: true,
      data: result.data,
    };
  }

  @Get('prediction/symbols')
  @ApiOperation({
    summary: 'Get supported symbols',
    description:
      'Get list of stock symbols with available trained models for predictions',
  })
  async getSupportedSymbols(): Promise<HttpResponse> {
    const result = await this.mlService.getSupportedSymbols();

    if (!result.success) {
      return generateInternalServerResult(result.message);
    }

    return {
      success: true,
      data: result.data,
    };
  }

  @Get('data-management/summary')
  @ApiOperation({
    summary: 'Get data management summary',
    description: 'Get dashboard statistics for ML processed stock data',
  })
  async getDataManagementSummary(): Promise<HttpResponse> {
    const result = await this.mlService.getDataManagementSummary();

    if (!result.success) {
      return generateInternalServerResult(result.message);
    }

    return {
      success: true,
      data: result.data,
    };
  }

  @Get('data-management/stocks')
  @ApiOperation({
    summary: 'Get data management stock list',
    description: 'Get list of stock symbols and processed data status',
  })
  async getDataManagementStocks(): Promise<HttpResponse> {
    const result = await this.mlService.getDataManagementStocks();

    if (!result.success) {
      return generateInternalServerResult(result.message);
    }

    return {
      success: true,
      data: result.data,
    };
  }

  @Post('data-management/update/:symbol')
  @ApiOperation({
    summary: 'Update data for a single symbol',
    description: 'Refresh data processing for a specific stock symbol',
  })
  async updateStockData(
    @Param('symbol') symbol: string,
  ): Promise<HttpResponse> {
    const result = await this.mlService.updateStockData(symbol);

    if (!result.success) {
      return generateInternalServerResult(result.message);
    }

    return {
      success: true,
      data: result.data,
    };
  }

  @Post('data-management/update-all')
  @ApiOperation({
    summary: 'Update data for all symbols',
    description: 'Refresh data processing for all supported stock symbols',
  })
  async updateAllStockData(): Promise<HttpResponse> {
    const result = await this.mlService.updateAllStockData();

    if (!result.success) {
      return generateInternalServerResult(result.message);
    }

    return {
      success: true,
      data: result.data,
    };
  }

  @Get('prediction/:symbol')
  @ApiOperation({
    summary: 'Get AI price prediction',
    description:
      'Get AI predicted prices for tomorrow, 3 days, 7 days, and 14 days ahead',
  })
  async getPrediction(@Param('symbol') symbol: string): Promise<HttpResponse> {
    const result = await this.mlService.getPrediction(symbol);

    if (!result.success) {
      return generateInternalServerResult(result.message);
    }

    return {
      success: true,
      data: result.data,
    };
  }
}
