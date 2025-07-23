import { AntrianPasien, AntrianPasienGet } from './request-payload.model';

export enum Jenis {
  JAMINAN = 'JAMINAN',
  UMUM = 'UMUM',
}
export class PasiensRequest {
  outlet_id: number;
  jenis: Jenis.JAMINAN | Jenis.UMUM;
}

export enum Status {
  WAITING = 'WAITING',
  CALL = 'CALL',
  COMPLETE = 'COMPLETE',
  CANCELED = 'CANCELED',
}

export const STATUS_ORDER = ['WAITING', 'CALL', 'SKIP', 'COMPLETE', 'CANCELED'];

export class UpdateDataAntrian {
  status_antrian_id: number;
  bintang: number;
  user_id?: number;
}

export class PasienStatusRequest {
  antrian_id: number;
  status: Status;
  user_id?: number;
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
