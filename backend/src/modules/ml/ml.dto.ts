import { ApiProperty } from '@nestjs/swagger';

export class IndexQuoteDto {
  @ApiProperty({
    description: 'Index code',
    example: 'VNINDEX',
  })
  code: string;

  @ApiProperty({
    description: 'Index name',
    example: 'VN-INDEX',
  })
  name: string;

  @ApiProperty({
    description: 'Current price',
    example: 1280.5,
  })
  price: number;

  @ApiProperty({
    description: 'Price change',
    example: 5.25,
  })
  change: number;

  @ApiProperty({
    description: 'Percentage change',
    example: 0.41,
  })
  change_percent: number;

  @ApiProperty({
    description: 'Day high',
    example: 1285.0,
    required: false,
  })
  high?: number;

  @ApiProperty({
    description: 'Day low',
    example: 1275.5,
    required: false,
  })
  low?: number;

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

  @ApiProperty({
    description: 'Data timestamp',
    example: '2026-04-03T10:30:00',
  })
  timestamp: string;
}

export class MLDTO {}
