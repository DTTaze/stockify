import { HttpResponse } from 'mvc-common-toolkit';

import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { QueryIcbDTO, QueryIcbStocksDTO } from '../dto/stocks.dto';
import { StockCategoriesService } from '../services/stock-categories.service';
import { StocksService } from '../services/stocks.service';

@ApiTags('Stock Categories')
@ApiBearerAuth()
@Controller('stock-categories')
export class StockCategoriesController {
  constructor(
    private readonly categoriesService: StockCategoriesService,
    private readonly stocksService: StocksService,
  ) {}

  @Get('market')
  async getMarketGroups(): Promise<HttpResponse> {
    return this.categoriesService.getMarketGroups();
  }

  @Get('icb')
  async getIcbIndustries(@Query() query: QueryIcbDTO): Promise<HttpResponse> {
    return this.categoriesService.getIcbIndustries(query);
  }

  @Get('icb/:icbCode')
  async getIcbStocks(
    @Param('icbCode') icbCode: string,
    @Query() query: QueryIcbStocksDTO,
  ): Promise<HttpResponse> {
    return this.categoriesService.getIcbStocks(icbCode, query);
  }

  @Get('ticker/:ticker')
  async getTickerCategories(
    @Param('ticker') ticker: string,
  ): Promise<HttpResponse> {
    return this.categoriesService.getTickerCategories(ticker);
  }

  @Get('futures')
  async getFutures(): Promise<HttpResponse> {
    return this.categoriesService.getFutures();
  }

  @Get('government-bonds')
  async getGovernmentBonds(): Promise<HttpResponse> {
    return this.categoriesService.getGovernmentBonds();
  }

  @Get('indices')
  async getIndices(): Promise<HttpResponse> {
    return this.categoriesService.getIndices();
  }

  @Post('sync-market-groups')
  async syncMarketGroups(): Promise<HttpResponse> {
    return this.stocksService.syncClassifications();
  }

  @Post('sync-icb-industries')
  async syncIcbIndustries(): Promise<HttpResponse> {
    return this.categoriesService.syncIcbIndustries();
  }

  @Post('sync-all')
  async syncAllCategories(): Promise<HttpResponse> {
    const marketResult = await this.stocksService.syncClassifications();
    if (!marketResult.success) {
      return marketResult;
    }
    const icbResult = await this.categoriesService.syncIcbIndustries();
    if (!icbResult.success) {
      return icbResult;
    }
    return {
      success: true,
      message: 'Synced all categories successfully',
      data: {
        market: marketResult.data,
        icb: icbResult.data,
      },
    };
  }
}
