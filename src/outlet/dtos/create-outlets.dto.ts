import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateOutletsDto {
  @ApiProperty()
  @IsString()
  nama_outlet: string;
}
