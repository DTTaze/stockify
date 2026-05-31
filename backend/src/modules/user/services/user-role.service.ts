import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { BaseCRUDService } from '@shared/services/base-crud.service';

import { Role } from '../entities/role.entity';
import { UserRole } from '../entities/user-role.entity';

@Injectable()
export class UserRolesService extends BaseCRUDService<UserRole> {
  constructor(
    @InjectRepository(UserRole)
    protected readonly repo: Repository<UserRole>,
  ) {
    super(repo);
  }

  public async assignRole(userId: string, roleId: string): Promise<UserRole> {
    const existed = await this.findOne({
      userId,
      roleId,
    });

    if (existed) {
      return existed;
    }

    return this.create({
      userId,
      roleId,
    });
  }

  public async removeRole(userId: string, roleId: string): Promise<void> {
    await this.repo.delete({
      userId,
      roleId,
    });
  }

  public async syncRoles(userId: string, roleIds: string[]): Promise<void> {
    await this.repo.delete({ userId });

    if (!roleIds?.length) {
      return;
    }

    await this.bulkCreate(
      roleIds.map((roleId) => ({
        userId,
        roleId,
      })),
    );
  }

  public async getRolesByUserId(userId: string): Promise<Role[]> {
    const rows = await this.findAll(
      { userId },
      {
        relations: {
          role: true,
        },
      },
    );

    return rows.map((item) => item.role).filter(Boolean);
  }

  public async getRoleNamesByUserId(userId: string): Promise<string[]> {
    const roles = await this.getRolesByUserId(userId);

    return roles.map((item) => item.name);
  }

  public async hasRole(userId: string, roleName: string): Promise<boolean> {
    const row = await this.findOne(
      {
        userId,
        role: {
          name: roleName,
        },
      },
      {
        relations: {
          role: true,
        },
      },
    );

    return !!row;
  }
}
