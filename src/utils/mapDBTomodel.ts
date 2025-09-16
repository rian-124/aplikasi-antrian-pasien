import {
  AntrianPasiens,
  TahapAntrians,
  StatusAntrians,
  Pasiens,
  Lokets,
  Outlets,
} from '@prisma/client';
import { AntrianPasien } from 'src/model/antrianpasien.model';

type AntrianWithRelations = AntrianPasiens & {
  tahap_antrian: TahapAntrians;
  status_antrian: StatusAntrians;
  pasien: Pasiens;
  users: { name: string } | null;
  outlets: Outlets;
  lokets: Lokets | null;
};

export const mapDBtoModelAntrianPasiens = (
  rows: AntrianWithRelations[],
): AntrianPasien[] => {
  if (!rows) return [];

  return rows.map((item) => ({
    id: item.id,
    nomor_antrian: item.nomor_Antrian,
    bintang: item.bintang,
    status: item.status_antrian.status,
    tahap: item.tahap_antrian.tahap,
    nomor_registrasi: item.pasien.nomor_registrasi,
    outlet: item.outlets.nama_outlet,
    loket: item.lokets ? item.lokets.nama_loket : null,
    user: {
      name: item.users ? item.users.name : null,
    },
    created_At: item.created_At,
    updated_At: item.update_At,
  }));
};
