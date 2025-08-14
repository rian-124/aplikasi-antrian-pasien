import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CheckUsernameDto {
  @ApiProperty()
  username: string;
}

export class CheckUsernameResponse {
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

export class JwtUsernameUsersPayload {
  sub: number;
  username: string;
}
