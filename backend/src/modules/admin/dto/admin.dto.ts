import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

// Role DTOs
export class CreateRoleDTO {
  @ApiProperty({
    description: 'Role name (unique)',
    example: 'moderator',
  })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({
    description: 'Role description',
    example: 'Moderator role for content management',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Is role active',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateRoleDTO {
  @ApiProperty({
    description: 'Role name',
    example: 'moderator',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @ApiProperty({
    description: 'Role description',
    example: 'Moderator role for content management',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Is role active',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class ListRoleDTO {
  @ApiProperty({
    description: 'Page number',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  page?: number;

  @ApiProperty({
    description: 'Items per page',
    example: 10,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  limit?: number;

  @ApiProperty({
    description: 'Search term for role name',
    example: 'admin',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;
}

// User Role DTOs
export class AssignUserRoleDTO {
  @ApiProperty({
    description: 'User ID',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'Role ID',
  })
  @IsString()
  roleId: string;
}

export class ListUserRolesDTO {
  @ApiProperty({
    description: 'Page number',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  page?: number;

  @ApiProperty({
    description: 'Items per page',
    example: 10,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  limit?: number;
}

export class SyncUserRolesDTO {
  @ApiProperty({
    description: 'User ID',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'Array of role IDs to assign',
    example: [1, 2],
  })
  @IsNumber({}, { each: true })
  roleIds: number[];
}
