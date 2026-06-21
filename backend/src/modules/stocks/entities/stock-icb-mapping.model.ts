import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { IcbIndustry } from './icb-industry.model';
import { Stock } from './stocks.model';

@Entity('stock_icb_mappings')
export class StockIcbMapping {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'stock_symbol' })
  stockSymbol: string;

  @Column({ name: 'icb_code' })
  icbCode: string;

  @ManyToOne(() => Stock, (s) => s.icbMappings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'stock_symbol', referencedColumnName: 'symbol' })
  stock: Stock;

  @ManyToOne(() => IcbIndustry, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'icb_code', referencedColumnName: 'code' })
  icbIndustry: IcbIndustry;
}
