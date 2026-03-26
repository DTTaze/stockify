import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AuthGuard } from '@shared/guards/auth.guard';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Post('register')
  async register(@Body() dto: any) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: any) {
    const result = await this.authService.login(dto);

    if (!result.success) return result;

    const token = await this.jwtService.signAsync({
      id: result.data.user.id,
    });

    return {
      success: true,
      data: {
        accessToken: token,
        user: result.data.user,
      },
    };
  }

  @UseGuards(AuthGuard)
  @Get('whoami')
  async whoami(@Body('user') user: any) {
    return {
      success: true,
      data: user,
    };
  }

  @UseGuards(AuthGuard)
  @Post('change-password')
  async changePassword(@Body() body: any) {
    return this.authService.changePassword(body.userId, body);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() dto: any) {
    return this.authService.forgotPassword(dto);
  }
}
