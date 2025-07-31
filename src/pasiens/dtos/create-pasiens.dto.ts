import { ApiProperty } from '@nestjs/swagger';
import { Jenis } from 'src/model/pasiens.model';

export class CreatePasiensDto {
  @ApiProperty()
  jenis: Jenis.JAMINAN | Jenis.UMUM;
}
