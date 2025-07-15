export class UserRegisterRequest {
  username: string;
  password: string;
  role_id: number;
}

export class UserResponse {
  username: string;
  token?: string | null;
}

export class LoginRequest {
  username: string;
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
