import { Request } from 'express';

import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { User } from '@modules/user/entities/user.entity';
import { UserRolesService } from '@modules/user/services/user-role.service';
import { UserService } from '@modules/user/services/user.service';

import { ENTITY_STATUS, ROLE_NAME } from '@shared/constants';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  protected logger = new Logger(AdminAuthGuard.name);

  constructor(
    private userRolesService: UserRolesService,
    private userService: UserService,
    private jwtService: JwtService,
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

      const hasAdminRole = await this.userRolesService.hasRole(
        user.id,
        ROLE_NAME.ADMIN,
      );

      if (!hasAdminRole) {
        throw new ForbiddenException(
          'Only admin users can access this resource',
        );
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
    return type === 'Bearer' ? token : undefined;
  }
}
