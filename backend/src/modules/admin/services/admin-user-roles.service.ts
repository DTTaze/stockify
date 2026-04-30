import { In } from 'typeorm';

import { Injectable } from '@nestjs/common';

import { RolesService } from '@modules/user/services/role.service';
import { UserRolesService } from '@modules/user/services/user-role.service';
import { UserService } from '@modules/user/services/user.service';

@Injectable()
export class AdminUserRolesService {
  constructor(
    private userRolesService: UserRolesService,
    private rolesService: RolesService,
    private userService: UserService,
  ) {}

  async getUserRoles(userId: string) {
    const user = await this.userService.findByID(userId);
    if (!user) {
      throw new Error('User not found');
    }

    return this.userRolesService.getRolesByUserId(userId);
  }

  async assignRole(userId: string, roleId: string) {
    const user = await this.userService.findByID(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const role = await this.rolesService.findByID(roleId);

    if (!role) {
      throw new Error('Role not found');
    }

    return this.userRolesService.assignRole(userId, roleId);
  }

  async removeRole(userId: string, roleId: string) {
    const user = await this.userService.findByID(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const role = await this.rolesService.findByID(roleId);
    if (!role) {
      throw new Error('Role not found');
    }

    await this.userRolesService.removeRole(userId, roleId);
  }
}
