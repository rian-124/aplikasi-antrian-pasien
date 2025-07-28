export class WebResponse<T> {
  status?: number;
  message?: string;
  data?: T;
  errors?: string;
}
