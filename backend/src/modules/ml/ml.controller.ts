import { HttpResponse } from 'mvc-common-toolkit';

import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { generateInternalServerResult } from '@shared/helpers/operation-result.helper';

import { MLService } from './ml.service';

@ApiTags('ML')
@ApiBearerAuth()
@Controller('ml')
export class MLController {
  constructor(protected mlService: MLService) {}

  @Get('indices/:indexCode/quote')
  @ApiOperation({
    summary: 'Get current index quote',
    description: 'Get current price and statistics for a specific stock index',
  })
  @ApiParam({
    name: 'indexCode',
    description: "Index code (e.g., 'vn-index', 'vn30', 'hnx-index', 'upcom')",
    example: 'vn-index',
  })
  async getIndexQuote(
    @Param('indexCode') indexCode: string,
  ): Promise<HttpResponse> {
    const getIndexQuoteResult = await this.mlService.getIndexQuote(indexCode);

    if (!getIndexQuoteResult.success) {
      return generateInternalServerResult(getIndexQuoteResult.message);
    }

    return {
      success: true,
      data: getIndexQuoteResult.data,
    };
  }
}
