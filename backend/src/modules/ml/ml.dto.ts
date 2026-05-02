import { IsEnum, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class IndexQuoteDto {
  @ApiProperty({
    description: 'Symbol',
    example: 'VCB',
  })
  symbol: string;

  @ApiProperty({
    description: 'Current price',
    example: 1280.5,
  })
  price: number;

  @ApiProperty({
    description: 'Percentage change',
    example: 0.41,
  })
  change_percent: number;

  @ApiProperty({
    description: 'Open price',
    example: 1275.25,
    required: false,
  })
  open?: number;

  @ApiProperty({
    description: 'Trading volume',
    example: 1000000,
    required: false,
  })
  volume?: number;
}

export enum MarketType {
  STOCK = 'stock',
  INDEX = 'index',
}

export enum TimePeriod {
  ONE_DAY = '1d',
  ONE_WEEK = '1w',
  ONE_MONTH = '1mo',
  THREE_MONTH = '3mo',
  SIX_MONTH = '6mo',
  ONE_YEAR = '1y',
}

export class MarketQuoteDto {
  @ApiProperty({
    description: 'Symbol of the market index',
    example: 'VCB',
  })
  @IsString()
  symbol: string;

  @ApiProperty({
    enum: MarketType,
    example: MarketType.INDEX,
  })
  @IsEnum(MarketType)
  type: MarketType;

  @ApiProperty({
    enum: TimePeriod,
    example: TimePeriod.ONE_DAY,
  })
  @IsEnum(TimePeriod)
  period: TimePeriod;
}

export class PredictionDto {
  @ApiProperty({
    description: 'Stock symbol',
    example: 'VCB',
  })
  symbol: string;

  @ApiProperty({
    description: 'Predicted price for tomorrow',
    example: 91200,
    required: false,
  })
  tomorrow?: number;

  @ApiProperty({
    description: 'Predicted price for 3 days ahead',
    example: 91800,
    required: false,
  })
  day3?: number;

  @ApiProperty({
    description: 'Predicted price for 7 days ahead',
    example: 93000,
    required: false,
  })
  day7?: number;

  @ApiProperty({
    description: 'Predicted price for 14 days ahead',
    example: 94500,
    required: false,
  })
  day14?: number;
}

export class SupportedSymbolsDto {
  @ApiProperty({
    description: 'List of supported stock symbols for prediction',
    example: ['VCB', 'VIC', 'VNM'],
    type: [String],
  })
  symbols: string[];
}

export class DataManagementStockDto {
  @ApiProperty({
    description: 'Stock symbol',
    example: 'VCB',
  })
  symbol: string;

  @ApiProperty({
    description: 'Last updated timestamp',
    example: '2026-04-25T14:00:00',
    required: false,
  })
  lastUpdated?: string;

  @ApiProperty({
    description: 'Total processed records',
    example: 1250,
  })
  totalRecords: number;

  @ApiProperty({
    description: 'Data update status',
    example: 'updated',
  })
  status: string;
}

export class DataManagementSummaryDto {
  @ApiProperty({
    description: 'Total supported stock symbols',
    example: 10,
  })
  totalStocks: number;

  @ApiProperty({
    description: 'Total stocks updated recently',
    example: 8,
  })
  updated: number;

  @ApiProperty({
    description: 'Total stocks that need update',
    example: 2,
  })
  needsUpdate: number;

  @ApiProperty({
    description: 'Total number of processed records',
    example: 56200,
  })
  totalRecords: number;
}

export class DataUpdateResponseDto {
  @ApiProperty({
    description: 'Stock symbol updated',
    example: 'VCB',
  })
  symbol: string;

  @ApiProperty({
    description: 'If the update completed successfully',
    example: true,
  })
  updated: boolean;

  @ApiProperty({
    description: 'Optional response message',
    example: 'Data for VCB has been updated.',
    required: false,
  })
  message?: string;

  @ApiProperty({
    description: 'Last updated timestamp after refresh',
    example: '2026-04-25T14:00:00',
    required: false,
  })
  lastUpdated?: string;
}

export class DataUpdateAllResponseDto {
  @ApiProperty({
    description: 'Number of symbols updated',
    example: 3,
  })
  updatedCount: number;

  @ApiProperty({
    description: 'List of symbols updated during the call',
    example: ['VCB', 'VIC', 'VNM'],
  })
  updatedSymbols: string[];

  @ApiProperty({
    description: 'Optional response message',
    example: 'Updated 3 symbols.',
    required: false,
  })
  message?: string;
}

export class MLDTO {}
