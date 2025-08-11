import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';
import { Request } from 'express';

export class CheckEmailDto {
  @ApiProperty()
  @IsEmail()
  email: string;
}

export class CheckEmailResponse {
  token?: string | null;
}

export class ResetPasswordDto {
  @ApiProperty()
  @IsString()
  token: string;
  @ApiProperty()
  @IsString()
  newPassword: string;
}

export class JwtEmailUsersPayload {
  sub: number;
  email: string;
}
