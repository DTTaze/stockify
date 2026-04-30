import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AdminUserRolesService } from '@modules/admin/services/admin-user-roles.service';

import { AdminAuthGuard } from '@shared/guards/admin.guard';

import { AssignUserRoleDTO } from '../dto/admin.dto';

@ApiTags('Admin - User Roles')
@ApiBearerAuth()
@Controller('admin/user-roles')
@UseGuards(AdminAuthGuard)
export class AdminUserRolesController {
  constructor(private adminUserRolesService: AdminUserRolesService) {}

  @ApiOperation({ summary: 'Get user roles by user ID' })
  @Get('user/:userId')
  async getUserRoles(@Param('userId') userId: string) {
    try {
      const data = await this.adminUserRolesService.getUserRoles(userId);

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

  @ApiOperation({ summary: 'Assign role to user' })
  @Post()
  async assignRoleToUser(@Body() dto: AssignUserRoleDTO) {
    try {
      const data = await this.adminUserRolesService.assignRole(
        dto.userId,
        dto.roleId,
      );

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

  @ApiOperation({ summary: 'Remove role from user' })
  @Delete(':userId/:roleId')
  async removeRoleFromUser(
    @Param('userId') userId: string,
    @Param('roleId') roleId: string,
  ) {
    try {
      await this.adminUserRolesService.removeRole(userId, roleId);

      return {
        success: true,
        message: 'Role removed successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error,
      };
    }
  }
}
