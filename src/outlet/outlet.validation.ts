import { ZodType } from 'zod';
import * as Z from 'zod';

export class OutletsValidation {
  static readonly OUTLETS: ZodType = Z.object({
    nama_outlet: Z.string().min(1).max(100),
  });
}
