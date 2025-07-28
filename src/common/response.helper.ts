import { WebResponse } from 'src/model/web.model';

export class ResponseHelper {
  static ok<T>(message: string, data?: T): WebResponse<T> {
    const response: WebResponse<T> = {
      status: 200,
      message,
    };

    if (response !== undefined) {
      response.data = data;
    }

    return response;
  }
}
