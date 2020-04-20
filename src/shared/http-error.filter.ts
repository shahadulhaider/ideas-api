import {
  ExceptionFilter,
  Catch,
  HttpException,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      status !== HttpStatus.INTERNAL_SERVER_ERROR
        ? exception.message || null
        : 'Internal server error';

    const { error } = JSON.parse(JSON.stringify(exception.getResponse()));

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toDateString(),
      name: exception.name,
      path: request.url,
      method: request.method,
      message,
      error,
    };

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      console.error(exception);
    }

    Logger.error(
      `${request.method} ${request.url}`,
      JSON.stringify(errorResponse, null, 4),
      `ExceptionFilter`,
      false,
    );

    response.status(status).json(errorResponse);
  }
}
