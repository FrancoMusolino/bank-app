import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';

type MyKnownError = {
  statusCode: HttpStatus;
  message: string | string[];
  error: string;
};

const isMyKnownError = (err: unknown): err is MyKnownError => {
  if (typeof err !== 'object' || err === null) return false;
  if (!('message' in err) || !('statusCode' in err)) return false;

  return true;
};

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<any>();

    const statusCode = exception.getStatus();
    const errorResponse = exception.getResponse();

    if (isMyKnownError(errorResponse)) {
      response.status(statusCode).json({
        path: request.url,
        method: request.method,
        timestamp: new Date().toISOString(),
        error: {
          ...errorResponse,
          message: Array.isArray(errorResponse.message)
            ? errorResponse.message[0]
            : errorResponse.message,
        },
      });
    } else {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: 'Server Eror',
      });
    }
  }
}
