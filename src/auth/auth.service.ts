import { JwtService } from '@nestjs/jwt';
import { jwtUserPayload } from 'src/model/user.model';

export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(user: jwtUserPayload) {
    const payload = {
      username: user.username,
      sub: user.id,
      role: user.role_id,
    };

    return {
      'access-token': await this.jwtService.signAsync(payload),
    };
  }
}
