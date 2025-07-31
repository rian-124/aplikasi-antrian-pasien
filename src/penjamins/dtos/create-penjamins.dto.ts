import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class CreatePenjaminsDto {
  @ApiProperty()
  @IsString()
  nama: string;

  @ApiProperty()
  @IsInt()
  jenis_registrasi_id: number;
}
