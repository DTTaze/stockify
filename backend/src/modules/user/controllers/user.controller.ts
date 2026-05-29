import { HttpResponse } from 'mvc-common-toolkit';

import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AdminAuthGuard } from '@shared/guards/admin.guard';
import { generateNotFoundResult } from '@shared/helpers/operation-result.helper';

import { UpdateUserStatusDTO } from '../dto/user.dto';
import { UserService } from '../services/user.service';

@ApiTags('User')
@ApiBearerAuth()
@UseGuards(AdminAuthGuard)
@Controller('user')
export class UserController {
  protected logger = new Logger(UserController.name);

  constructor(protected userService: UserService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all users',
    description: 'Retrieve list of all non-deleted users',
  })
  async getUsers(): Promise<any> {
    return this.userService.findAll();
  }

  @Patch(':id/status')
  @ApiOperation({
    summary: 'Update user status',
    description: 'Lock or unlock a user account',
  })
  async updateUserStatus(
    @Param('id') id: string,
    @Body() dto: UpdateUserStatusDTO,
  ): Promise<any> {
    const user = await this.userService.findByID(id);

    if (!user) {
      return generateNotFoundResult('User not found');
    }

    return this.userService.updateByID(id, {
      status: dto.status,
    });
  }
}
