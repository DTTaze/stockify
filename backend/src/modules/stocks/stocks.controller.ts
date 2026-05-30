import { HttpResponse } from 'mvc-common-toolkit';

import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CrawlStocksDTO, QueryStocksDTO } from './stocks.dto';
import { StocksService } from './stocks.service';

@ApiTags('Stocks')
@ApiBearerAuth()
@Controller('stocks')
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}

  @Get()
  async getStocks(@Query() query: QueryStocksDTO): Promise<HttpResponse> {
    return this.stocksService.getStocks(query);
  }

  @Post('crawl')
  async crawlStocks(@Body() body: CrawlStocksDTO): Promise<HttpResponse> {
    return this.stocksService.crawlAndSave(body.exchange);
  }

  @Post('sync-categories')
  async syncCategories(): Promise<HttpResponse> {
    return this.stocksService.syncClassifications();
  }

  @Get('classification-summary')
  async getClassificationSummary(): Promise<HttpResponse> {
    return this.stocksService.getClassificationSummary();
  }
}
