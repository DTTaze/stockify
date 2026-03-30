import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { ENTITY_STATUS } from '@shared/constants';
import { Audit } from '@shared/models/audit.model';

@Entity('users')
export class User extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column({ nullable: true })
  password: string;

  @Column({ default: ENTITY_STATUS.ACTIVE })
  status: ENTITY_STATUS;

  @Column({
    type: 'nvarchar',
    nullable: true,
  })
  metadata: string;
}
