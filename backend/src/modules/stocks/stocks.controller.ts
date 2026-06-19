import { HttpResponse } from 'mvc-common-toolkit';

import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { TimePeriod } from '../ml/ml.dto';
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

  @Get(':symbol/quote')
  @ApiOperation({
    summary: 'Get latest stock quote',
    description:
      'Compute current price, change percent, and volume from stored data, falling back to ML service if needed',
  })
  async getStockQuote(@Param('symbol') symbol: string): Promise<HttpResponse> {
    return this.stocksService.getStockQuote(symbol);
  }

  @Get(':symbol/historical')
  @ApiOperation({
    summary: 'Get stock historical prices by period',
    description:
      'Get historical price data from the database filtered by time period (1d, 1w, 1mo, 3mo, 6mo, 1y)',
  })
  async getHistoricalByPeriod(
    @Param('symbol') symbol: string,
    @Query('period') period?: string,
  ): Promise<HttpResponse> {
    return this.stocksService.getHistoricalByPeriod(symbol, period || '1mo');
  }

  @Get(':symbol/latest-date')
  @ApiOperation({ summary: 'Get latest stock price date in DB' })
  async getLatestPriceDate(
    @Param('symbol') symbol: string,
  ): Promise<HttpResponse> {
    return this.stocksService.getLatestPriceDate(symbol);
  }

  @Post(':symbol/history')
  @ApiOperation({ summary: 'Save historical prices' })
  async saveHistoricalPrices(
    @Param('symbol') symbol: string,
    @Body() body: Array<Record<string, unknown>>,
  ): Promise<HttpResponse> {
    return this.stocksService.saveHistoricalPrices(symbol, body);
  }

  @Get(':symbol/history')
  @ApiOperation({ summary: 'Get stock historical prices (raw)' })
  async getHistoricalPrices(
    @Param('symbol') symbol: string,
    @Query('period') period?: string,
    @Query('start') start?: string,
    @Query('end') end?: string,
  ): Promise<HttpResponse> {
    return this.stocksService.getHistoricalPrices(
      symbol,
      period as TimePeriod,
      start,
      end,
    );
  }
}
