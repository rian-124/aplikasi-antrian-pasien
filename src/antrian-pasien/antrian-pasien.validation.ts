import * as Z from 'zod';
import { ZodType } from 'zod';

export class StatusPasienValidation {
  static readonly STATUS: ZodType = Z.object({
    antrian_id: Z.number(),
    status: Z.enum(['WAITING', 'CALL', 'COMPLETE', 'CANCELED']),
  });
}
