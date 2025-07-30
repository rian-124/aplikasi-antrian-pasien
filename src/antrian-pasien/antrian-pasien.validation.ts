import * as Z from 'zod';
import { ZodType } from 'zod';

export class StatusAntrianValidation {
  static readonly STATUS: ZodType = Z.object({
    status: Z.enum(['WAITING', 'CALL', 'COMPLETE', 'CANCELED']),
  });
}
