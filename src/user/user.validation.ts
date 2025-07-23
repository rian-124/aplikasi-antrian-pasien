import { UserUpdateRequest } from 'src/model/user.model';
import { ZodType } from 'zod';
import * as Z from 'zod';

export class UserValidation {
  static readonly REGISTER: ZodType = Z.object({
    email: Z.email().min(1).max(100),
    name: Z.string().min(1).max(200),
    password: Z.string().min(1).max(100),
    outlet_id: Z.int(),
    role_id: Z.int(),
  });

  static readonly UPDATE: ZodType<UserUpdateRequest> = Z.object({
    email: Z.email().min(1).max(100).optional(),
    name: Z.string().min(1).max(200).optional(),
    password: Z.string().min(1).max(100).optional(),
    outlet_id: Z.int().optional(),
    role_id: Z.int().optional(),
  });

  static readonly LOGIN: ZodType = Z.object({
    email: Z.string().min(1).max(200),
    password: Z.string().min(1).max(100),
  });
}
