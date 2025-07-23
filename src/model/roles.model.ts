export class RolesRequest {
  name: string;
}

export class RolesResponse {
  status: number;
  message: string;
  name?: string;
  data?: any;
}
