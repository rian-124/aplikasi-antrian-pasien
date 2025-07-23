export class UserRegisterRequest {
  email: string;
  name: string;
  password: string;
  outlet_id: number;
  role_id: number;
}
export class UserUpdateRequest {
  email?: string;
  name?: string;
  password?: string;
  outlet_id?: number;
  role_id?: number;
}

export class UserUpdateResponse {
  status: number;
  message: string;
  data: any;
}

export class UserDeleteResponse {
  status: number;
  message: string;
}

export class UserResponseRegister {
  status: number;
  message: string;
  email: string;
}

export class UserResposeGetAll {
  status: number;
  message: string;
  data: any[];
}

export class UserResponseLogin {
  status: number;
  message: string;
  email: string;
  role_id: number;
  outlet_id: number;
  token?: string | null;
}

export class LoginRequest {
  email: string;
  password: string;
}

export class jwtUserPayload {
  id: number;
  username: string;
  role_id: number;
}

export class JwtUserResponsePayload {
  sub: number;
  username: string;
  role: number;
}
