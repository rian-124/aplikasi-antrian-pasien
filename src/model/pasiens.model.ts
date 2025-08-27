import { ApiProperty } from '@nestjs/swagger';
import { AntrianPasien, AntrianPasienGet } from './request-payload.model';

export enum Jenis {
  JAMINAN = 'JAMINAN',
  UMUM = 'UMUM',
}
export class PasiensRequest {
  @ApiProperty()
  outlet_id: number;
  @ApiProperty()
  jenis: Jenis.JAMINAN | Jenis.UMUM;
}

export class PasiensRequestUpdate {
  @ApiProperty()
  penjamin_id: number;
}

export enum Status {
  WAITING = 'WAITING',
  CALL = 'CALL',
  SKIPPED = 'SKIPPED',
  COMPLETE = 'COMPLETE',
  CANCELED = 'CANCELED',
}

export const STATUS_ORDER = [
  'WAITING',
  'CALL',
  'SKIPED',
  'COMPLETE',
  'CANCELED',
];

export class UpdateDataAntrian {
  status_antrian_id: number;
  bintang: number;
  user_id?: number;
}

export class PasienStatusRequest {
  @ApiProperty()
  status: Status;
}

export class AntrianStatusMessage {
  status: number;
  message: string;
  data: AntrianPasien;
}

export class AntrianPasienAll {
  status: number;
  message: string;
  data: AntrianPasienGet[];
}
