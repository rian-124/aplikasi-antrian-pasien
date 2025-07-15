import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { ZodError } from 'zod';
import { Response } from 'express';

@Catch()
export class ErrorFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const response: Response = host.switchToHttp().getResponse();

    if (exception instanceof HttpException) {
      response.status(exception.getStatus()).json({
        errors: exception.getResponse(),
      });
    } else if (exception instanceof ZodError) {
      let parsedErrors: unknown;

      try {
        parsedErrors = JSON.parse(exception.message);
      } catch {
        parsedErrors = exception.message;
      }

      response.status(400).json({
        errors: parsedErrors,
      });
    } else {
      response.status(500).json({
        errors:
          exception instanceof Error
            ? exception.message
            : 'Internar server error',
      });
    }
  }
}
