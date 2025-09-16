export type PatientStatus =
  | "WAITING"
  | "CALL"
  | "COMPLETE"
  | "CANCELED"
  | "SKIPPED"
  | "RECALL";

export class Patient {
  id: number;
  no: number;
  patientNumber: string;
  labReg: string;
  outlet: string;
  userName: string;
  bintang: number;
  jenisRegistrasiId: number;
  status: PatientStatus;
  createdAt: Date;
  updatedAt: Date;
  loket: string;

  constructor(params: {
    id: number;
    no: number;
    patientNumber: string;
    labReg: string;

    outlet: string;
    userName: string;
    bintang: number;
    jenisRegistrasiId: number;
    status: PatientStatus;
    createdAt: Date;
    updatedAt: Date;
    loket: string;
  }) {
    this.id = params.id;
    this.no = params.no;
    this.patientNumber = params.patientNumber;
    this.labReg = params.labReg;
    this.outlet = params.outlet;
    this.userName = params.userName;
    this.bintang = params.bintang;
    this.jenisRegistrasiId = params.jenisRegistrasiId;
    this.status = params.status;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
    this.loket = params.loket;
  }

  static fromJSON(
    data: any,
    index: number,
  ): Patient {
    if (!data) {
      throw new Error("Invalid patient data: data is null or undefined");
    }

    return new Patient({
      id: data.id ?? 0,
      no: index + 1,
      patientNumber: data.nomor_antrian ?? "-",
      labReg: data.nomor_registrasi ?? "-",
      outlet: data.outlet,
      userName: data.users?.name ?? "-",
      bintang: data.bintang ?? 0,
      jenisRegistrasiId: data.pasien?.jenis_registrasi_id ?? 0,
      status: (data.status ?? "WAITING") as PatientStatus,
      createdAt: new Date(data.createdAt ?? data.created_At ?? Date.now()),
      updatedAt: new Date(data.updatedAt ?? data.update_At ?? Date.now()),
      loket: data.loket,
    });
  }
}