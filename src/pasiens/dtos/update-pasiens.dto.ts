import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class UpdatePasiensDto {
  @ApiProperty()
  @IsNumber()
  penjamin_id: number;
}
