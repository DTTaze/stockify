import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { StockGroup } from './stock-group.model';
import { Stock } from './stocks.model';

@Entity('stock_group_mappings')
export class StockGroupMapping {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'stock_symbol' })
  stockSymbol: string;

  @Column({ name: 'group_id' })
  groupId: number;

  @ManyToOne(() => Stock, (s) => s.mappings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'stock_symbol', referencedColumnName: 'symbol' })
  stock: Stock;

  @ManyToOne(() => StockGroup, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'group_id' })
  stockGroup: StockGroup;
}
