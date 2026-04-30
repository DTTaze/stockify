import { Injectable } from '@nestjs/common';

import { RolesService } from '@modules/user/services/role.service';

import { CreateRoleDTO, UpdateRoleDTO } from '../dto/admin.dto';

@Injectable()
export class AdminRolesService {
  constructor(private rolesService: RolesService) {}

  async getRoleById(id: number) {
    return this.rolesService.findByID(id);
  }

  async createRole(dto: CreateRoleDTO) {
    const existing = await this.rolesService.findByName(dto.name);

    if (existing) {
      throw new Error('Role with this name already exists');
    }

    return this.rolesService.create({
      name: dto.name,
      description: dto.description,
      isActive: dto.isActive !== undefined ? dto.isActive : true,
    });
  }

  async updateRole(id: number, dto: UpdateRoleDTO) {
    const role = await this.rolesService.findByID(id);
    if (!role) {
      return null;
    }

    if (dto.name && dto.name !== role.name) {
      const existing = await this.rolesService.findByName(dto.name);
      if (existing) {
        throw new Error('Role with this name already exists');
      }
    }

    return this.rolesService.update(id, dto);
  }

  async deleteRole(id: number) {
    const role = await this.rolesService.findByID(id);
    if (!role) {
      return null;
    }

    if (['admin', 'user'].includes(role.name)) {
      throw new Error('Cannot delete default roles');
    }

    await this.rolesService.delete(id);
    return true;
  }
}
