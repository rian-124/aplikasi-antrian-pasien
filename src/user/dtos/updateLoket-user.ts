import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class UpdateLoketUserDto {
  @ApiProperty()
  @IsInt()
  loket_id: number;
}
