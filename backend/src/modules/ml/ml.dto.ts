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

export class MLDTO {}
