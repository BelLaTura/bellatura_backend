import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  INestApplication,
} from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';
import { AppResponseDto } from 'src/types/app-response.dto';

@Catch(EntityNotFoundError)
export class TypeORMExceptionFilterNotFound implements ExceptionFilter {
  catch(exception: EntityNotFoundError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const json: AppResponseDto = {
      statusCode: 404,
      status: 'Not Found',
      message: 'Not Found',
      data: '' + exception,
    };

    response.status(json.statusCode).send(json);
  }
}

@Catch(QueryFailedError)
export class TypeORMExceptionFilterQueryFailed implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let statusCode = 500;
    let status = 'Internal Server Error';
    let message = 'Internal Server Error';
    let data = {};

    if (exception.message.includes('Duplicate entry')) {
      statusCode = 409;
      status = 'Conflict';
      message = `Дубликат: ${exception.message}`;
      data = '' + exception.message;
    }

    const json: AppResponseDto = {
      statusCode,
      status,
      message,
      data,
    };

    response.status(json.statusCode).send(json);
  }
}

export default function setupTypeormFilter(app: INestApplication) {
  app.useGlobalFilters(new TypeORMExceptionFilterNotFound());
  app.useGlobalFilters(new TypeORMExceptionFilterQueryFailed());
}
