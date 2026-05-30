import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

import { Audit } from '@shared/models/audit.model';

import { StockGroupMapping } from './stock-group-mapping.model';

@Entity('stocks')
export class Stock extends Audit {
  @PrimaryColumn()
  symbol: string;

  @Column({ name: 'exchange' })
  exchange: string;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'type', nullable: true })
  type: string;

  @Column({ name: 'sid', nullable: true, type: 'int' })
  sid: number;

  @Column({ name: 'en_organ_name', nullable: true })
  enOrganName: string;

  @Column({ name: 'en_organ_short_name', nullable: true })
  enOrganShortName: string;

  @Column({ name: 'organ_short_name', nullable: true })
  organShortName: string;

  @Column({ name: 'organ_name', nullable: true })
  organName: string;

  @Column({ name: 'product_grp_id', nullable: true })
  productGrpId: string;

  @Column({ name: 'icb_code2', nullable: true })
  icbCode2: string;

  @Column({ name: 'index_group', nullable: true })
  indexGroup: string;

  @OneToMany(() => StockGroupMapping, (m) => m.stock)
  mappings: StockGroupMapping[];
}
