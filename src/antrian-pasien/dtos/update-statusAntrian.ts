import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Status } from 'src/model/pasiens.model';

export class UpdateStatusAntrianDto {
  @ApiProperty()
  @IsString()
  status: Status;
}
