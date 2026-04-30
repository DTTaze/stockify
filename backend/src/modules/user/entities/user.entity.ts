import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ENTITY_STATUS } from '@shared/constants';
import { Audit } from '@shared/models/audit.model';

import { UserRole } from './user-role.entity';

@Entity('users')
export class User extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @Index()
  email: string;

  @Column({ unique: true })
  @Index()
  username: string;

  @Column()
  password: string;

  @Column({
    default: ENTITY_STATUS.ACTIVE,
  })
  status: ENTITY_STATUS;

  @OneToMany(() => UserRole, (userRole) => userRole.user)
  userRoles: UserRole[];

  @Column({
    type: 'nvarchar',
    length: 'MAX',
    nullable: true,
  })
  metadata: string;
}
