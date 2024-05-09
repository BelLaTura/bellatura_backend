import { Response } from 'express';
import { Injectable } from '@nestjs/common';
import GetResponse from './utils/getResponse';

@Injectable()
export class AppService {
  getHello(res: Response) {
    const url = process.env.APP__SWAGGER_HOST;
    const response = GetResponse.getOkResponse('Hello, World!', {
      swagger: `${url}/api/swagger`,
    });
    return res.status(response.statusCode).send(response);
  }
}
