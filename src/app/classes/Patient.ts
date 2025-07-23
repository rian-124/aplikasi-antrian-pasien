export type PatientStatus = 'WAITING' | 'CALLED'| 'COMPLETED'| 'CANCELLED';

export class Patient {
  constructor(
    public id: number,
    public no: number,
    public patientNumber: string,
    public labReg: string,
    public outlet: string,
    public status: PatientStatus,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}

  updateStatus(newStatus: PatientStatus) {
    this.status = newStatus;
    this.updatedAt = new Date();
  }

  static fromJSON(data: any): Patient {
    return new Patient(
      data.id,
      data.no,
      data.patientNumber,
      data.labReg,
      data.outlet,
      data.status as PatientStatus,
      new Date(data.createdAt),
      new Date(data.updatedAt)
    );
  }
}
