import { ApiProperty } from '@nestjs/swagger';

export class RolesRequest {
  @ApiProperty()
  name: string;
}

export class RolesResponse {
  name?: string;
  data?: any;
}

export class RolesDeleteResponse {
  status: number;
  message: string;
}
