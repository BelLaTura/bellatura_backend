import { ResponseDto } from 'src/types/response.dto';

export default class GetResponse {
  static getOkResponse(message: string, data: any) {
    const response: ResponseDto = {
      statusCode: 200,
      status: 'OK',
      message,
      data,
    };
    return response;
  }

  static getCreatedResponse(message: string, data: any) {
    const response: ResponseDto = {
      statusCode: 201,
      status: 'CREATED',
      message,
      data,
    };
    return response;
  }

  static getBadRequestResponse(message: string, data: any) {
    const response: ResponseDto = {
      statusCode: 400,
      status: 'BAD REQUEST',
      message,
      data,
    };
    return response;
  }

  static getUnauthorizedResponse(message: string, data: any) {
    const response: ResponseDto = {
      statusCode: 401,
      status: 'UNAUTHORIZED',
      message,
      data,
    };
    return response;
  }

  static getNotFoundResponse(message: string, data: any) {
    const response: ResponseDto = {
      statusCode: 404,
      status: 'NOT FOUND',
      message,
      data,
    };
    return response;
  }

  static getConflictResponse(message: string, data: any) {
    const response: ResponseDto = {
      statusCode: 409,
      status: 'CONFLICT',
      message,
      data,
    };
    return response;
  }
}
