export type PatientStatus = "WAITING" | "CALL" | "COMPLETE" | "CANCELED" | "SKIPPED";

export class Patient {
  id: number;
  no: number;
  patientNumber: string;  
  labReg: string;          
  outletId: number;
  outlet: string;
  userName: string;
  bintang: number;
  jenisRegistrasiId: number;
  status: PatientStatus;
  createdAt: Date;
  updatedAt: Date;
  loketId?: number;

  constructor(params: {
    id: number;
    no: number;
    patientNumber: string;
    labReg: string;
    outletId: number;
    outlet: string;
    userName: string;
    bintang: number;
    jenisRegistrasiId: number;
    status: PatientStatus;
    createdAt: Date;
    updatedAt: Date;
    loketId?: number;
  }) {
    this.id = params.id;
    this.no = params.no;
    this.patientNumber = params.patientNumber;
    this.labReg = params.labReg;
    this.outletId = params.outletId;
    this.outlet = params.outlet;
    this.userName = params.userName;
    this.bintang = params.bintang;
    this.jenisRegistrasiId = params.jenisRegistrasiId;
    this.status = params.status;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
    this.loketId = params.loketId;
  }

  static fromJSON(data: any, index: number, outletMap: Map<number, string>): Patient {
    if (!data) {
      throw new Error("Invalid patient data: data is null or undefined");
    }

    const outletId = data.outlet_id ?? 0;
    const outletName = outletMap.get(outletId) ?? "-";

    return new Patient({
      id: data.id ?? 0,
      no: index + 1,
      patientNumber: data.nomor_Antrian ?? "-", 
      labReg: data.pasien?.nomor_registrasi ?? "-", 
      outletId,
      outlet: outletName,
      userName: data.users?.name ?? "-",
      bintang: data.bintang ?? 0,
      jenisRegistrasiId: data.pasien?.jenis_registrasi_id ?? 0,
      status: (data.status_antrian?.status ?? "WAITING") as PatientStatus,
      createdAt: new Date(data.createdAt ?? data.created_At ?? Date.now()), 
      updatedAt: new Date(data.updatedAt ?? data.update_At ?? Date.now()),
      loketId: data.loket_id ?? undefined,
    });
  }
}
