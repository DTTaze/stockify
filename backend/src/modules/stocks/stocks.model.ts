import { Column, Entity, PrimaryColumn } from 'typeorm';

import { Audit } from '@shared/models/audit.model';

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
}
