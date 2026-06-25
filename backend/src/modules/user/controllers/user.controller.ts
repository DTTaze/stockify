import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AdminAuthGuard } from '@shared/guards/admin.guard';
import { generateNotFoundResult } from '@shared/helpers/operation-result.helper';

import { QueryUsersDTO, UpdateUserStatusDTO } from '../dto/user.dto';
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
    summary: 'Get all users with pagination and search',
    description:
      'Retrieve list of all non-deleted users with offset, limit, and keyword search',
  })
  async getUsers(@Query() query: QueryUsersDTO): Promise<any> {
    return this.userService.findPaginated(query);
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

  @Patch(':id/reset-password')
  @ApiOperation({
    summary: 'Reset user password',
    description: 'Admin reset user password manually',
  })
  async resetPassword(
    @Param('id') id: string,
    @Body() dto: { password?: string },
  ): Promise<any> {
    const user = await this.userService.findByID(id);

    if (!user) {
      return generateNotFoundResult('User not found');
    }

    const newPassword = dto.password || '12345678a';
    await this.userService.updatePassword(id, newPassword);

    return {
      success: true,
      message: 'Password reset successfully',
    };
  }
}
