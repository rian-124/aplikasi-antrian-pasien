import { AntrianPasien, AntrianPasienGet } from './jenis-registrasi.model';

export enum Jenis {
  JAMINAN = 'JAMINAN',
  UMUM = 'UMUM',
}
export class PasiensRequest {
  jenis: Jenis.JAMINAN | Jenis.UMUM;
}

export enum Status {
  WAITING = 'WAITING',
  CALL = 'CALL',
  COMPLETE = 'COMPLETE',
  CANCELED = 'CANCELED',
}

export const STATUS_ORDER = ['WAITING', 'CALL', 'COMPLETE', 'CANCELED'];

export class PasienStatusRequest {
  antrian_id: number;
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
