import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AdminAuthGuard } from '@shared/guards/admin.guard';

import { CreateRoleDTO, UpdateRoleDTO } from '../dto/admin.dto';
import { AdminRolesService } from '../services/admin-roles.service';

@ApiTags('Admin - Roles')
@ApiBearerAuth()
@Controller('admin/roles')
@UseGuards(AdminAuthGuard)
export class AdminRolesController {
  constructor(private adminRolesService: AdminRolesService) {}

  @ApiOperation({ summary: 'Get role by ID' })
  @Get(':id')
  async getRoleById(@Param('id') id: number) {
    try {
      const data = await this.adminRolesService.getRoleById(id);

      if (!data) {
        return {
          success: false,
          message: 'Role not found',
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        message: error,
      };
    }
  }

  @ApiOperation({ summary: 'Create new role' })
  @Post()
  async createRole(@Body() dto: CreateRoleDTO) {
    try {
      const data = await this.adminRolesService.createRole(dto);

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        message: error,
      };
    }
  }

  @ApiOperation({ summary: 'Update role' })
  @Patch(':id')
  async updateRole(@Param('id') id: number, @Body() dto: UpdateRoleDTO) {
    try {
      const data = await this.adminRolesService.updateRole(id, dto);

      if (!data) {
        return {
          success: false,
          message: 'Role not found',
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        message: error,
      };
    }
  }

  @ApiOperation({ summary: 'Delete role' })
  @Delete(':id')
  async deleteRole(@Param('id') id: number) {
    try {
      const result = await this.adminRolesService.deleteRole(id);

      if (!result) {
        return {
          success: false,
          message: 'Role not found',
        };
      }

      return {
        success: true,
        message: 'Role deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error,
      };
    }
  }
}
