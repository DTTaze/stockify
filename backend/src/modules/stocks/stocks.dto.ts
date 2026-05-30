import { IsEnum, IsOptional, IsString } from 'class-validator';

import { ApiPropertyOptional } from '@nestjs/swagger';

import { PaginationDTO } from '@shared/common/pagination.dto';

export enum ExchangeFilter {
  HOSE = 'HOSE',
  HNX = 'HNX',
  UPCOM = 'UPCOM',
  DELISTED = 'DELISTED',
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

  @ApiPropertyOptional({
    description:
      'Filter by index group or exchange (e.g., VN30, CW, ETF, HOSE, HNX, UPCOM)',
  })
  @IsString()
  @IsOptional()
  group?: string;
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
