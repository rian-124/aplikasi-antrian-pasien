import { ApiProperty } from '@nestjs/swagger';

export class OutletsRequest {
  @ApiProperty()
  nama_outlet: string;
}

export class OutletsResponse {
  status: number;
  message: string;
  data?: any;
}
