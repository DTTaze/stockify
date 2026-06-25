import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { PaginationDTO } from '@shared/common/pagination.dto';
import { ENTITY_STATUS } from '@shared/constants';
import {
  OnlyTextAndNumbers,
  TrimAndLowercase,
} from '@shared/decorators/sanitize-input.decorator';

export class QueryUsersDTO extends PaginationDTO {
  @ApiPropertyOptional({
    description: 'Keyword to search username or email',
  })
  @IsString()
  @IsOptional()
  keyword?: string;

  @ApiPropertyOptional({
    description: 'Filter by status',
    enum: ENTITY_STATUS,
  })
  @IsEnum(ENTITY_STATUS)
  @IsOptional()
  status?: ENTITY_STATUS;
}

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
