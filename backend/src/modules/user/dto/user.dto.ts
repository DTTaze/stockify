import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { ENTITY_STATUS } from '@shared/constants';
import {
  OnlyTextAndNumbers,
  TrimAndLowercase,
} from '@shared/decorators/sanitize-input.decorator';

export class UpdateUserStatusDTO {
  @ApiProperty({ enum: ENTITY_STATUS, example: ENTITY_STATUS.SUSPENDED })
  @IsEnum(ENTITY_STATUS)
  status: ENTITY_STATUS;
}

export class VerifyUniquenessUserDTO {
  @IsOptional()
  @IsEmail()
  @TrimAndLowercase()
  email: string;

  @IsOptional()
  @OnlyTextAndNumbers({
    includeWhitespaces: false,
    onlyASCII: true,
    throwOnError: true,
    allowedSymbols: false,
  })
  @TrimAndLowercase()
  username: string;
}

export class AssignRoleDTO {
  @IsString()
  userId: string;

  @IsNumber()
  roleId: number;
}
