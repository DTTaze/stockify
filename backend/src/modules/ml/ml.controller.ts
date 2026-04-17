import { HttpResponse } from 'mvc-common-toolkit';

import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { generateInternalServerResult } from '@shared/helpers/operation-result.helper';

import { MarketQuoteDto } from './ml.dto';
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
}
