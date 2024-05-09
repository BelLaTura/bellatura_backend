import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { AppResponseDto } from 'src/types/app-response.dto';

export class PublicSession {
  @ApiProperty()
  rs_id: number;

  @ApiProperty()
  rs_ip: string;

  @ApiProperty()
  rs_agent: string;

  @ApiProperty()
  rs_date: string;

  @ApiProperty()
  rs_userId: number;
}

// POST /sessions

export class CreateSessionBodyDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  rs_loginOrEmail: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  rs_password: string;
}

export class CreateSessionsResponseDataDto extends PublicSession {
  @ApiProperty()
  rs_accessToken: string;

  @ApiProperty()
  rs_refreshToken: string;

  @ApiProperty()
  rs_ip: string;

  @ApiProperty()
  rs_agent: string;

  @ApiProperty()
  rs_userId: number;
}

export class CreateSessionResponseDto extends AppResponseDto {
  @ApiProperty({ type: CreateSessionsResponseDataDto })
  data: CreateSessionsResponseDataDto;
}

// GET /sessions

export class GetSessionsReponseDataDto {
  @ApiProperty({ type: PublicSession })
  current_session: PublicSession;

  @ApiProperty({ type: [PublicSession] })
  other_sessions: PublicSession[];
}

export class GetSessionsReponseDto extends AppResponseDto {
  @ApiProperty({ type: GetSessionsReponseDataDto })
  data: GetSessionsReponseDataDto;
}

// GET /sessions/[id]

export class GetSessionReponseDataDto extends PublicSession {}

export class GetSessionReponseDto extends AppResponseDto {
  @ApiProperty({ type: GetSessionReponseDataDto })
  data: GetSessionReponseDataDto;
}

// UPDATE /sessios

export class UpdateSessionReponseDataDto extends PublicSession {}

export class UpdateSessionReponseDto extends AppResponseDto {
  @ApiProperty({ type: UpdateSessionReponseDataDto })
  data: UpdateSessionReponseDataDto;
}

// DELETE /sessios/[id]

export class DeleteSessionResponseDto extends AppResponseDto {}

// DELETE /sessios

export class DeleteSessionsResponseDto extends AppResponseDto {}
