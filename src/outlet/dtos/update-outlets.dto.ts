import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateOutletsDto {
  @ApiProperty()
  @IsString()
  nama_outlet: string;
}
