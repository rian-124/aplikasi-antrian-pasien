export type PatientStatus = "WAITING" | "CALL" | "COMPLETE" | "CANCELED";

class Patient {
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
  loketId?: number; 
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: number,
    no: number,
    patientNumber: string,
    labReg: string,
    outletId: number,
    outlet: string,
    userName: string,
    bintang: number,
    jenisRegistrasiId: number,
    status: PatientStatus,
    createdAt: Date,
    updatedAt: Date,
    loketId?: number
  ) {
    this.id = id;
    this.no = no;
    this.patientNumber = patientNumber;
    this.labReg = labReg;
    this.outletId = outletId;
    this.outlet = outlet;
    this.userName = userName;
    this.bintang = bintang;
    this.jenisRegistrasiId = jenisRegistrasiId;
    this.status = status;
    this.loketId = loketId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromJSON(data: any, index: number, outletMap: Map<number, string>): Patient {
    if (!data) {
      throw new Error("Invalid patient data: data is null or undefined");
    }

    const outletId = data.outlet_id ?? data.outletId ?? 0;
    const outletName = outletMap.get(outletId) ?? "-";

    return new Patient(
      data.id ?? 0,
      index + 1,
      data.patientNumber 
        ?? data.nomor_Antrian 
        ?? data.pasien?.nomor_registrasi 
        ?? "-",  
      data.labReg 
        ?? data.lab_reg 
        ?? data.pasien?.nomor_registrasi 
        ?? "-",
      outletId,
      outletName,
      data.users?.name ?? data.userName ?? "-",
      data.bintang ?? 0,
      data.pasien?.jenis_registrasi_id ?? data.jenisRegistrasiId ?? 0,
      (data.status_antrian?.status ?? data.status) as PatientStatus ?? "WAITING",
      new Date(data.created_At ?? data.createdAt ?? data.created_at ?? Date.now()),
      new Date(data.update_At ?? data.updatedAt ?? data.updated_at ?? Date.now()),
      data.loket_id ?? data.loketId 
    );
  }
}

export { Patient };
