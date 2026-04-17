import { Column, Entity, PrimaryColumn } from 'typeorm';

import { Audit } from '@shared/models/audit.model';

@Entity('stock_companies')
export class StockCompanies extends Audit {
  @PrimaryColumn()
  symbol: string;

  @Column({ name: 'organization_name' })
  organizationName: string;
}
