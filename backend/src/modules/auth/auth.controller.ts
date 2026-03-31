import { HttpResponse } from 'mvc-common-toolkit';

import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { User } from '@modules/user/user.model';
import { UserService } from '@modules/user/user.service';

import { LogId } from '@shared/decorators/logging.decorator';
import { RequestUser } from '@shared/decorators/request-user.decorator';
import { AuthGuard } from '@shared/guards/auth.guard';
import { extractUserInfo } from '@shared/helpers/common';
import { UseCallQueue } from '@shared/interceptors/call-queue.interceptor';
import { ApplyRateLimiting } from '@shared/interceptors/rate-limiting.interceptor';

import { ForgotPasswordDTO, LoginDTO, RegisterDTO } from './auth.dto';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    protected userService: UserService,

    private jwtService: JwtService,
  ) {}

  @ApiOperation({ summary: 'Register a new user' })
  @UseCallQueue()
  @ApplyRateLimiting(5)
  @Post('register')
  public async register(@LogId() logId: string, @Body() dto: RegisterDTO) {
    const validateResult = dto.validate();

    if (!validateResult.success) {
      return validateResult;
    }

    const verifyUniquenessRes = await this.userService.verifyUniquenessUser({
      email: dto.email,
      username: dto.username,
    });

    if (!verifyUniquenessRes.success) {
      return verifyUniquenessRes;
    }

    const registerResult = await this.authService.register(logId, dto);

    if (!registerResult.success) {
      return registerResult;
    }

    return {
      success: true,
    };
  }

  @ApiOperation({ summary: 'Login' })
  @UseCallQueue()
  @ApplyRateLimiting(5)
  @Post('login')
  public async login(
    @LogId() logId: string,
    @Body() dto: LoginDTO,
  ): Promise<HttpResponse> {
    const loginResult = await this.authService.login(logId, dto);

    if (!loginResult.success) {
      return loginResult;
    }

    const { data } = loginResult;

    const accessToken = await this.jwtService.signAsync({
      id: data.id,
    });

    return {
      success: true,
      data: {
        accessToken,
        user: data,
      },
    };
  }

  @ApiOperation({ summary: 'Who am i' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('whoami')
  public whoami(@RequestUser() user: User): HttpResponse {
    return {
      success: true,
      data: extractUserInfo(user),
    };
  }

  @UseGuards(AuthGuard)
  @Post('change-password')
  async changePassword(@Body() body: any) {
    return this.authService.changePassword(body.userId, body);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDTO) {
    return this.authService.forgotPassword(dto);
  }
}
