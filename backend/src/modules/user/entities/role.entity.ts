import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { UserRole } from '@modules/user/entities/user-role.entity';

import { Audit } from '@shared/models/audit.model';

@Entity('roles')
export class Role extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ unique: true, length: 50 })
  @Index()
  name: string;

  @Column({ nullable: true, length: 255 })
  description: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => UserRole, (userRole) => userRole.role)
  userRoles: UserRole[];
}
