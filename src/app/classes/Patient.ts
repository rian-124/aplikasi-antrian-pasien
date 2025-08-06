export type PatientStatus = 'WAITING' | 'CALL' | 'COMPLETE' | 'CANCELED' | 'SKIP';

export class Patient {
  constructor(
    public id: number,
    public no: number,
    public patientNumber: string,
    public labReg: string,
    public outlet: string,
    public status: PatientStatus,
    public userName: string,         
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}

  updateStatus(newStatus: PatientStatus) {
    this.status = newStatus;
    this.updatedAt = new Date();
  }

    static fromJSON(data: any, index: number): Patient {
    return new Patient(
      data.id,
      index + 1,
      data.nomor_Antrian,                          
      data.pasien.nomor_registrasi,              
      data.outlet?.nama_outlet || "-",            
      data.status_antrian.status as PatientStatus, 
      data.users?.name || "-",                    
      new Date(data.created_At),                  
      new Date(data.update_At)                    
    );
  }
}
