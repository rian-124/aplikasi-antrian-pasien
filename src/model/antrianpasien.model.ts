export class NomorAntrianPasienResponse {
  nomor_Antrian: string;
  users: { name: string } | null;
  pasien: {
    jenis_registrasis: {
      jenis: string;
    };
  };
}
