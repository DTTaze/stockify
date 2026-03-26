import { bcryptHelper, stringUtils } from 'mvc-common-toolkit';

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserService } from '@modules/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(dto: any) {
    const hashedPassword = await bcryptHelper.hash(dto.password, 10);

    const user = await this.userService.create({
      email: dto.email,
      fullName: dto.username,
      password: hashedPassword,
    });

    return { success: true, data: user };
  }

  async login(dto: any) {
    const user = await this.userService.findOne({ email: dto.email });

    if (!user) {
      return { success: false, message: 'User not found' };
    }

    const isValid = await bcryptHelper.compare(dto.password, user.password);

    if (!isValid) {
      return { success: false, message: 'Wrong password' };
    }

    const token = await this.jwtService.signAsync({ id: user.id });

    return {
      success: true,
      data: {
        accessToken: token,
        user,
      },
    };
  }

  async changePassword(userId: string, dto: any) {
    const user = await this.userService.findByID(userId);

    if (!user) {
      return { success: false, message: 'User not found' };
    }

    const isValid = await bcryptHelper.compare(dto.oldPassword, user.password);

    if (!isValid) {
      return { success: false, message: 'Old password incorrect' };
    }

    const newPassword = await bcryptHelper.hash(dto.newPassword);

    await this.userService.updateByID(userId, {
      password: newPassword,
    });

    return { success: true };
  }

  async forgotPassword(dto: any) {
    const user = await this.userService.findOne({ email: dto.email });

    if (!user) {
      return { success: false, message: 'User not found' };
    }

    const newPassword = stringUtils.generatePassword(10);
    const hashedPassword = await bcryptHelper.hash(newPassword);

    await this.userService.updateByID(user.id, {
      password: hashedPassword,
    });

    return {
      success: true,
      data: { newPassword },
    };
  }
}
