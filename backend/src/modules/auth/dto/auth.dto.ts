import {
  IsAlphanumeric,
  IsEmail,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';
import { OperationResult } from 'mvc-common-toolkit';

import { ApiProperty } from '@nestjs/swagger';

import { ERR_CODE } from '@shared/constants';
import {
  OnlyTextAndNumbers,
  TrimAndLowercase,
} from '@shared/decorators/sanitize-input.decorator';
import { generateBadRequestResult } from '@shared/helpers/operation-result.helper';
import { isEmailValid } from '@shared/utils/email';

export class RegisterDTO {
  public validate(): OperationResult {
    if (!isEmailValid(this.email)) {
      return generateBadRequestResult(
        'email is not valid',
        ERR_CODE.EMAIL_NOT_VALID,
      );
    }

    return {
      success: true,
    };
  }
  @ApiProperty({
    description: 'The email of the user',
  })
  @IsEmail()
  @TrimAndLowercase()
  email: string;

  @ApiProperty({
    description: 'The username of the user',
  })
  @IsString()
  @IsAlphanumeric()
  @OnlyTextAndNumbers({
    includeWhitespaces: false,
    onlyASCII: true,
    throwOnError: true,
    allowedSymbols: false,
  })
  @TrimAndLowercase()
  username: string;

  @ApiProperty({
    description: 'The password of the user',
  })
  @IsString()
  @IsStrongPassword()
  password: string;
}

export class LoginDTO {
  @ApiProperty({ example: 'user@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Password@123' })
  @IsString()
  @MinLength(8)
  @MaxLength(50)
  password: string;
}

export class ForgotPasswordDTO {
  @ApiProperty({ example: 'user@gmail.com' })
  @IsEmail()
  email: string;
}

export class ResetPasswordDTO {
  @ApiProperty({ example: 'reset-token-123' })
  @IsString()
  token: string;

  @ApiProperty({ example: 'NewPassword@123' })
  @IsString()
  @MinLength(8)
  @MaxLength(50)
  password: string;
}
