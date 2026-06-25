import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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

export class QueryIcbDTO {
  @ApiPropertyOptional({
    description: 'Filter by level (1, 2, 3, 4)',
    minimum: 1,
    maximum: 4,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(4)
  level?: number;
}

export class QueryIcbStocksDTO extends PaginationDTO {
  @ApiPropertyOptional({
    description: 'Keyword to search symbol or name',
  })
  @IsString()
  @IsOptional()
  keyword?: string;
}

export class SyncGroupPricesDTO {
  @ApiProperty({
    description: 'Code of the stock group to sync (e.g., VN100, VN30)',
  })
  @IsString()
  groupCode: string;
}
