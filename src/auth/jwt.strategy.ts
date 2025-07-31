import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtUserResponsePayload } from 'src/model/user.model';
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET!,
    });
  }

  validate(payload: JwtUserResponsePayload) {
    return {
      sub: payload.sub,
      email: payload.email,
      role: payload.role,
      outlet: payload.outlet,
      permission: payload.permission || [],
    };
  }
}
