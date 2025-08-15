import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class UpdateLoketUserDto {
  @ApiProperty()
  @IsInt()
  loket_id: number;
}

export class UpdateLoketUserResponse {
  lokets: {
    nama_loket: string | null;
  } | null;
}

// export class NomorAntrianPasienResponse {
//   nomor_Antrian: string;
//   users: { name: string } | null;
//   pasien: {
//     jenis_registrasis: {
//       jenis: string;
//     };
//   };
// }
