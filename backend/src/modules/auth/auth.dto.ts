import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class RegisterDTO {
  @ApiProperty({ example: 'user@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Nguyen Van A', required: false })
  @IsString()
  fullName?: string;

  @ApiProperty({ example: 'Password@123' })
  @IsString()
  @MinLength(8)
  @MaxLength(50)
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
