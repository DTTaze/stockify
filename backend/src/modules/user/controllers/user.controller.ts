import { HttpResponse } from 'mvc-common-toolkit';

import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AdminAuthGuard } from '@shared/guards/admin.guard';
import { generateInternalServerResult } from '@shared/helpers/operation-result.helper';

import { UpdateUserStatusDTO } from '../dto/user.dto';
import { UserService } from '../services/user.service';

@ApiTags('User')
@ApiBearerAuth()
@UseGuards(AdminAuthGuard)
@Controller('user')
export class UserController {
  constructor(protected userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users', description: 'Retrieve list of all non-deleted users' })
  async getUsers(): Promise<HttpResponse> {
    try {
      const users = await this.userService.findAll();
      return { success: true, data: users };
    } catch (error) {
      const message = error instanceof Error ? error.message : undefined;
      return generateInternalServerResult(message);
    }
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update user status', description: 'Lock or unlock a user account' })
  async updateUserStatus(
    @Param('id') id: string,
    @Body() dto: UpdateUserStatusDTO,
  ): Promise<HttpResponse> {
    try {
      const user = await this.userService.findByID(id);
      if (!user) {
        return generateInternalServerResult('User not found');
      }
      await this.userService.updateByID(id, { status: dto.status });
      return { success: true, data: null };
    } catch (error) {
      const message = error instanceof Error ? error.message : undefined;
      return generateInternalServerResult(message);
    }
  }
}
