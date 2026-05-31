import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { Role } from '@modules/user/entities/role.entity';
import { User } from '@modules/user/entities/user.entity';

import { Audit } from '@shared/models/audit.model';

@Entity('user_roles')
export class UserRole extends Audit {
  @PrimaryColumn('uuid')
  userId: string;

  @PrimaryColumn()
  roleId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @ManyToOne(() => Role, { onDelete: 'CASCADE' })
  @JoinColumn()
  role: Role;
}
