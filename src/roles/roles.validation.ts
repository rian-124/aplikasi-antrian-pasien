import * as Z from 'zod';
import { ZodType } from 'zod';

export class RolesValidation {
  static readonly STOREROLES: ZodType = Z.object({
    name: Z.string().min(1).max(100),
  });
}
