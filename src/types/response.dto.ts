import { ApiProperty } from '@nestjs/swagger';

export class ResponseDto {
  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  status: string;

  @ApiProperty()
  message: string;

  @ApiProperty()
  data: any;
}
