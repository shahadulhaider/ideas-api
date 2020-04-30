import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { GqlArgumentsHost, GqlExceptionFilter } from '@nestjs/graphql';
import { Request, Response } from 'express';
import { GraphQLResolveInfo } from 'graphql';

@Catch()
export class HttpErrorFilter implements ExceptionFilter, GqlExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const gqlHost = GqlArgumentsHost.create(host);
    const info = gqlHost.getInfo<GraphQLResolveInfo>();

    const status =
      exception instanceof HttpException && exception.getStatus
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
      message,
      error,
    };

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      console.error(exception);
    }

    if (request) {
      const error = {
        ...errorResponse,
        path: request.url,
        method: request.method,
      };

      Logger.error(
        `${request.method} ${request.url}`,
        JSON.stringify(error, null, 4),
        `ExceptionFilter`,
        false,
      );
      response.status(status).json(error);
    } else {
      const error = {
        ...errorResponse,
        type: info.parentType,
        field: info.fieldName,
      };

      Logger.error(
        `${request.method} ${request.url}`,
        JSON.stringify(error, null, 4),
        `ExceptionFilter`,
        false,
      );
      return exception;
    }
  }
}
