import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

import { Audit } from '@shared/models/audit.model';

@Entity('watchlist_items')
@Unique(['userId', 'symbol'])
export class WatchlistItem extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  symbol: string;
}
