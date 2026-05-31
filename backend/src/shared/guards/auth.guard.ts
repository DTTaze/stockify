import { Request } from 'express';

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { User } from '@modules/user/entities/user.entity';
import { UserService } from '@modules/user/services/user.service';

import { ENTITY_STATUS } from '@shared/constants';

@Injectable()
export class AuthGuard implements CanActivate {
  protected logger = new Logger(AuthGuard.name);

  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      const { id } = payload;

      const user: User = await this.userService.findByID(id);

      if (!user || user.status !== ENTITY_STATUS.ACTIVE) {
        throw new UnauthorizedException();
      }

      request.user = { id };
      request.activeUser = user;
    } catch (error: any) {
      this.logger.error(error.message);
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    if (type === 'Bearer') {
      return token;
    }
    if (request.query && request.query.token) {
      return request.query.token as string;
    }
    return undefined;
  }
}
