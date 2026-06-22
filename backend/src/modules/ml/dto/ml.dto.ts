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
    description: 'Current price',
    example: 90000,
    required: false,
  })
  current_price?: number;

  @ApiProperty({
    description: 'Predicted price for tomorrow',
    example: 91200,
    required: false,
  })
  tomorrow?: number;

  @ApiProperty({
    description: 'Tomorrow confidence',
    example: 92,
    required: false,
  })
  tomorrow_confidence?: number;

  @ApiProperty({
    description: 'Predicted price for 3 days ahead',
    example: 91800,
    required: false,
  })
  day3?: number;

  @ApiProperty({
    description: '3 days confidence',
    example: 88,
    required: false,
  })
  day3_confidence?: number;

  @ApiProperty({
    description: 'Predicted price for 7 days ahead',
    example: 93000,
    required: false,
  })
  day7?: number;

  @ApiProperty({
    description: '7 days confidence',
    example: 85,
    required: false,
  })
  day7_confidence?: number;

  @ApiProperty({
    description: 'Predicted price for 14 days ahead',
    example: 94500,
    required: false,
  })
  day14?: number;

  @ApiProperty({
    description: '14 days confidence',
    example: 78,
    required: false,
  })
  day14_confidence?: number;

  @ApiProperty({
    description: 'Model evaluation metrics',
    required: false,
  })
  metrics?: any;

  @ApiProperty({
    description: 'Historical comparison of actual vs predicted prices',
    required: false,
  })
  history_compare?: any[];
}


export class SupportedSymbolsDto {
  @ApiProperty({
    description: 'List of supported stock symbols for prediction',
    example: ['VCB', 'VIC', 'VNM'],
    type: [String],
  })
  symbols: string[];
}

export class MarketListDto {
  @ApiProperty({ enum: MarketType, example: MarketType.STOCK })
  @IsEnum(MarketType)
  type: MarketType;
}

export class MLDTO {}
