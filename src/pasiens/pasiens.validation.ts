import { ZodType } from 'zod';
import * as Z from 'zod';
export class PasiensValidation {
  static readonly JENIS: ZodType = Z.object({
    jenis: Z.enum(['UMUM', 'JAMINAN']),
  });
}
