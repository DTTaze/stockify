import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  LOCKED = 'LOCKED',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ name: 'password_hash', type: 'nvarchar', nullable: false })
  password: string;

  @Column({ name: 'full_name', type: 'nvarchar', length: 255, nullable: true })
  fullName: string;

  @Column({
    type: 'varchar',
    length: 10,
  })
  role: UserRole;

  @Column({
    type: 'varchar',
    length: 10,
  })
  status: UserStatus;

  @Column({
    name: 'created_at',
    type: 'datetime2',
    default: () => 'GETDATE()',
  })
  createdAt: Date;

  @Column({
    name: 'updated_at',
    type: 'datetime2',
    default: () => 'GETDATE()',
  })
  updatedAt: Date;
}
