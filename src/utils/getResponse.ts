import { AppResponseDto } from 'src/types/app-response.dto';

export default class GetResponse {
  static getOkResponse(message: string, data: any) {
    const response: AppResponseDto = {
      statusCode: 200,
      status: 'OK',
      message,
      data,
    };
    return response;
  }

  static getCreatedResponse(message: string, data: any) {
    const response: AppResponseDto = {
      statusCode: 201,
      status: 'CREATED',
      message,
      data,
    };
    return response;
  }

  static getBadRequestResponse(message: string, data: any) {
    const response: AppResponseDto = {
      statusCode: 400,
      status: 'BAD REQUEST',
      message,
      data,
    };
    return response;
  }

  static getUnauthorizedResponse(message: string, data: any) {
    const response: AppResponseDto = {
      statusCode: 401,
      status: 'UNAUTHORIZED',
      message,
      data,
    };
    return response;
  }

  static getNotFoundResponse(message: string, data: any) {
    const response: AppResponseDto = {
      statusCode: 404,
      status: 'NOT FOUND',
      message,
      data,
    };
    return response;
  }

  static getConflictResponse(message: string, data: any) {
    const response: AppResponseDto = {
      statusCode: 409,
      status: 'CONFLICT',
      message,
      data,
    };
    return response;
  }
}
