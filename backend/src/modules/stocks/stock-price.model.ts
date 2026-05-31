import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { Audit } from '@shared/models/audit.model';

import { Stock } from './stocks.model';

@Entity('stock_prices')
export class StockPrice extends Audit {
  @PrimaryColumn({ name: 'symbol' })
  symbol: string;

  @PrimaryColumn({ name: 'date', type: 'datetime2' })
  date: Date;

  @Column({ name: 'open', type: 'float', nullable: true })
  open: number;

  @Column({ name: 'high', type: 'float', nullable: true })
  high: number;

  @Column({ name: 'low', type: 'float', nullable: true })
  low: number;

  @Column({ name: 'close', type: 'float', nullable: true })
  close: number;

  @Column({ name: 'volume', type: 'bigint', nullable: true })
  volume: number;

  @ManyToOne(() => Stock, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'symbol', referencedColumnName: 'symbol' })
  stock: Stock;
}
