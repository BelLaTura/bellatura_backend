import {
  HttpException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import GetResponse from 'src/utils/getResponse';

export default function setupPipe(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        const json = GetResponse.getBadRequestResponse('', {});

        const array = [];
        errors.forEach((error) => {
          const messages = error.constraints
            ? Object.values(error.constraints)
            : ['Validation failed'];

          array.push(...messages);
        });

        json.message = array[0];
        json.data = errors;

        throw new HttpException(json, json.statusCode);
      },
    }),
  );
}
