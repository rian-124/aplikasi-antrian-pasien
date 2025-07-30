import * as Z from 'zod';
import { ZodType } from 'zod';

export class ValidationRequestPenjamin {
  static readonly PENJAMINS: ZodType = Z.object({
    nama: Z.string().min(1).max(100),
    jenis_registrasi_id: Z.number(),
  });
}
