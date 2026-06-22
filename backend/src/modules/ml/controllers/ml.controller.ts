import { HttpResponse } from 'mvc-common-toolkit';

import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { MarketListDto, MarketQuoteDto } from '../dto/ml.dto';
import { MLService } from '../services/ml.service';

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
    return this.mlService.getMarketQuote(query);
  }

  @Get('market/list')
  @ApiOperation({
    summary: 'Get market list',
    description: 'Retrieve list of available market symbols',
  })
  async getMarketList(@Query() query: MarketListDto): Promise<HttpResponse> {
    return this.mlService.getMarketList(query.type);
  }

  @Get('market/history')
  @ApiOperation({
    summary: 'Get market quote history',
    description: 'Retrieve historical price data for a given symbol',
  })
  async getMarketHistory(
    @Query() query: MarketQuoteDto,
  ): Promise<HttpResponse> {
    return this.mlService.getMarketHistory(query);
  }

  @Get('prediction/symbols')
  @ApiOperation({
    summary: 'Get supported symbols',
    description:
      'Get list of stock symbols with available trained models for predictions',
  })
  async getSupportedSymbols(): Promise<HttpResponse> {
    return this.mlService.getSupportedSymbols();
  }

  @Get('prediction/:symbol')
  @ApiOperation({
    summary: 'Get AI price prediction',
    description:
      'Get AI predicted prices for tomorrow, 3 days, 7 days, and 14 days ahead',
  })
  async getPrediction(
    @Param('symbol') symbol: string,
    @Query('modelType') modelType?: string,
  ): Promise<HttpResponse> {
    return this.mlService.getPrediction(symbol, modelType);
  }
}
