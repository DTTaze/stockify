import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('stock_groups')
export class StockGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'code', unique: true })
  code: string;

  @Column({ name: 'name' })
  name: string;
}
