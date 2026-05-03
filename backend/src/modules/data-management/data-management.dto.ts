import { IsEnum, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

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
