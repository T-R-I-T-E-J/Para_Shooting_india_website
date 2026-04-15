import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message: string | string[] = 'Internal server error';

    if (exception instanceof HttpException) {
      const responseBody = exception.getResponse() as Record<string, unknown> | string;
      message = 
        typeof responseBody === 'object' && responseBody !== null && 'message' in responseBody
          ? (responseBody.message as string | string[])
          : (responseBody as string);
    }

    const errorResponse: Record<string, unknown> = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
    };

    if (
      process.env.NODE_ENV !== 'production' &&
      process.env.NODE_ENV !== 'prod'
    ) {
      errorResponse.rawError =
        exception instanceof Error
          ? { message: exception.message, stack: exception.stack }
          : String(exception);
    }

    // Log the error
    console.error('--- EXCEPTION DEBUG START ---');
    console.error(exception);
    if (exception instanceof Error) {
      console.error(exception.stack);
    }
    console.error('--- EXCEPTION DEBUG END ---');

    this.logger.error(
      `${request.method} ${request.url}`,
      exception instanceof Error ? exception.stack : 'Unknown error',
    );

    response.status(status).json(errorResponse);
  }
}
