import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty()
  @IsOptional()
  username?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  outlet_id?: number;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  loket_id?: number;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  role_id?: number;
}
