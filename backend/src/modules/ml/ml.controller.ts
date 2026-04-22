import { HttpResponse } from 'mvc-common-toolkit';

import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { generateInternalServerResult } from '@shared/helpers/operation-result.helper';

import { MarketListDto, MarketQuoteDto, PredictionDto, SupportedSymbolsDto } from './ml.dto';
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

  @Get('market/list')
  @ApiOperation({ summary: 'Get market list', description: 'Retrieve list of available market symbols' })
  async getMarketList(@Query() query: MarketListDto): Promise<HttpResponse> {
    const result = await this.mlService.getMarketList(query.type);

    if (!result.success) {
      return generateInternalServerResult(result.message);
    }

    return { success: true, data: result.data };
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
