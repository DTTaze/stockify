import {
  AuditService,
  ErrorLog,
  OperationResult,
  bcryptHelper,
  stringUtils,
} from 'mvc-common-toolkit';

import { Inject, Injectable, Logger } from '@nestjs/common';

import { UserRolesService } from '@modules/user/services/user-role.service';
import { UserService } from '@modules/user/services/user.service';

import {
  APP_ACTION,
  ENTITY_STATUS,
  ERR_CODE,
  INJECTION_TOKEN,
} from '@shared/constants';
import { extractUserInfo } from '@shared/helpers/common';
import {
  generateConflictResult,
  generateForbiddenResult,
  generateInternalServerResult,
  generateNotFoundResult,
} from '@shared/helpers/operation-result.helper';
import { UserAuthProfile } from '@shared/interfaces';

import { LoginDTO, RegisterDTO } from '../dto/auth.dto';

@Injectable()
export class AuthService {
  protected logger = new Logger(AuthService.name);

  constructor(
    private userService: UserService,
    private userRolesService: UserRolesService,

    @Inject(INJECTION_TOKEN.AUDIT_SERVICE)
    protected auditService: AuditService,
  ) {}

  public async register(logId: string, dto: RegisterDTO) {
    try {
      const passwordHash = await bcryptHelper.hash(dto.password, 10);

      const user = await this.userService.create({
        username: dto.username,
        email: dto.email,
        password: passwordHash,
      });

      return {
        success: true,
        data: user,
      };
    } catch (error) {
      this.logger.error(error);

      this.auditService.emitLog(
        new ErrorLog({
          logId,
          message: error,
          payload: JSON.stringify(dto, stringUtils.maskFn),
          action: APP_ACTION.REGISTER,
        }),
      );

      return generateInternalServerResult();
    }
  }

  public async login(
    logId: string,
    data: LoginDTO,
  ): Promise<OperationResult<UserAuthProfile>> {
    try {
      const user = await this.userService.findOne({ email: data.email });

      if (!user) {
        return generateNotFoundResult(
          'user not found',
          ERR_CODE.USER_NOT_FOUND,
        );
      }

      if (user.status !== ENTITY_STATUS.ACTIVE) {
        return generateForbiddenResult(
          'user not active',
          ERR_CODE.ACCOUNT_DEACTIVATED,
        );
      }

      if (!user.password) {
        return generateConflictResult(
          'password incorrect',
          ERR_CODE.PASSWORD_INCORRECT,
        );
      }

      const isPasswordValid = await bcryptHelper.compare(
        data.password,
        user.password,
      );

      if (!isPasswordValid) {
        return generateConflictResult(
          'password incorrect',
          ERR_CODE.PASSWORD_INCORRECT,
        );
      }

      const roles = await this.userRolesService.getRoleNamesByUserId(user.id);

      return {
        success: true,
        data: {
          ...extractUserInfo(user),
          roles,
        },
      };
    } catch (error) {
      this.logger.error(error);

      this.auditService.emitLog(
        new ErrorLog({
          logId,
          message: error,
          payload: JSON.stringify(data, stringUtils.maskFn),
          action: APP_ACTION.LOGIN,
        }),
      );

      return generateInternalServerResult();
    }
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
