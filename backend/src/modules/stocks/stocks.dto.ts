import { IsEnum, IsOptional, IsString } from 'class-validator';

import { ApiPropertyOptional } from '@nestjs/swagger';

import { PaginationDTO } from '@shared/common/pagination.dto';

export enum ExchangeFilter {
  HOSE = 'HOSE',
  HNX = 'HNX',
  UPCOM = 'UPCOM',
  ALL = 'ALL',
}

export class QueryStocksDTO extends PaginationDTO {
  @ApiPropertyOptional({
    enum: ExchangeFilter,
    default: ExchangeFilter.ALL,
    description: 'Filter by exchange',
  })
  @IsEnum(ExchangeFilter)
  @IsOptional()
  exchange?: ExchangeFilter;

  @ApiPropertyOptional({
    description: 'Keyword to search symbol or name',
  })
  @IsString()
  @IsOptional()
  keyword?: string;
}

export class CrawlStocksDTO {
  @ApiPropertyOptional({
    enum: ExchangeFilter,
    default: ExchangeFilter.ALL,
    description: 'Exchange to crawl symbols for',
  })
  @IsEnum(ExchangeFilter)
  @IsOptional()
  exchange?: ExchangeFilter = ExchangeFilter.ALL;
}
