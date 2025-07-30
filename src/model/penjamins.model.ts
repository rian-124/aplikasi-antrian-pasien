import { ApiProperty } from '@nestjs/swagger';

export class PenjaminsRequest {
  @ApiProperty()
  nama: string;
  @ApiProperty()
  jenis_registrasi_id: number;
}

export class PenjaminsResponse {
  status: number;
  message: string;
}
