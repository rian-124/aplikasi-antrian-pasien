import { ZodType } from 'zod';
import * as Z from 'zod';

export class UserValidation {
  static readonly REGISTER: ZodType = Z.object({
    username: Z.string().min(1).max(200),
    password: Z.string().min(1).max(100),
    role_id: Z.int(),
  });

  static readonly LOGIN: ZodType = Z.object({
    username: Z.string().min(1).max(200),
    password: Z.string().min(1).max(100),
  });
}
