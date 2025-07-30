import { ZodType } from 'zod';
import * as Z from 'zod';
export class PasiensValidation {
  static readonly JENIS: ZodType = Z.object({
    outlet_id: Z.number(),
    jenis: Z.enum(['UMUM', 'JAMINAN']),
  });
}

export class PasiensValidationUpdate {
  static readonly PENJAMINSID: ZodType = Z.object({
    penjamin_id: Z.number(),
  });
}

export class StatusPasienValidation {
  static readonly STATUS: ZodType = Z.object({
    antrian_id: Z.number(),
    status: Z.enum(['WAITING', 'CALL', 'COMPLETE', 'CANCELED']),
  });
}
