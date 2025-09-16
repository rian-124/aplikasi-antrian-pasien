export interface AntrianPasien {
  id: number;
  nomor_antrian: string;
  bintang: number;
  status: string;
  tahap: string;
  nomor_registrasi: string;
  outlet: string;
  loket: string | null;
  user: {
    name: string | null;
  };
  created_At: Date;
  updated_At: Date;
}

export interface AntrianPasiensResponse {
  antrian_pasiens: AntrianPasien[];
}

export class NomorAntrianPasienResponse {
  nomor_Antrian: string;
  users: { name: string } | null;
  pasien: {
    jenis_registrasis: {
      jenis: string;
    };
  };
}

export class RecapAntrianPasienResponse {
  perday: {
    user_id: number;
    total: number;
    perday: string;
  }[];
  permonth: {
    user_id: number;
    total: number;
    permonth: string;
  }[];
  peryear: {
    user_id: number;
    total: number;
    peryear: string;
  }[];
}

// {
//   "perhari": [
//     { "user_id": 1, "total": 5, "perday": "2025-08-27" }
//   ],
//   "perbulan": [
//     { "user_id": 1, "total": 5, "permonth": "2025-08" }
//   ],
//   "pertahun": [
//     { "user_id": 1, "total": 5, "peryear": 2025 }
//   ]
// }
