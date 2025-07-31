import { Request } from 'express';
import { UsersGetAll } from './request-payload.model';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserRegisterRequest {
  @ApiProperty()
  email: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  password: string;
  @ApiProperty()
  outlet_id: number;
  @ApiProperty()
  role_id: number;
}
export class UserUpdateRequest {
  @ApiPropertyOptional()
  email?: string;
  @ApiPropertyOptional()
  name?: string;
  @ApiPropertyOptional()
  password?: string;
  @ApiPropertyOptional()
  outlet_id?: number;
  @ApiPropertyOptional()
  role_id?: number;
}

export class UserUpdateResponse {
  data: any;
}

export class UserDeleteResponse {
  status: number;
  message: string;
}

export class UserResponseRegister {
  email: string;
}

export class UserResponseGetAll {
  data: UsersGetAll[];
}

export class UserResponseLogin {
  token?: string | null;
}

export class LoginRequest {
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
}

export class jwtUserPayload {
  id: number;
  email: string;
  role: string;
}

export class JwtUserResponsePayload {
  sub: number;
  email: string;
  role: string;
  outlet: string;
  permission: string[];
}
export type AuthenticatedRequest = Request & { user: JwtUserResponsePayload };
