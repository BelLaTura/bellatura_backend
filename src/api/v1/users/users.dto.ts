import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';
import { AppResponseDto } from 'src/types/app-response.dto';

export class QueryCreateUserDto {
  @IsNumber()
  @ApiProperty({ example: 1 })
  rs_ref: number;

  @IsEmail()
  @ApiProperty({ example: 'ivanov@site.local' })
  rs_email: string;

  @MinLength(3)
  @IsString()
  @ApiProperty({ example: 'ivanov' })
  rs_login: string;

  @MinLength(2)
  @IsString()
  @ApiProperty({ example: 'Иванов' })
  rs_surname: string;

  @MinLength(2)
  @ApiProperty({ example: 'Иван' })
  rs_name: string;

  @IsString()
  @ApiProperty({ example: 'Иванович' })
  rs_middlename: string;

  @IsString()
  @ApiProperty({ example: 'secret' })
  rs_password: string;

  @IsDateString()
  @ApiProperty({ example: '2024-01-01' })
  rs_birthday: string;

  @IsPhoneNumber()
  @ApiProperty({ example: '+375331112233' })
  rs_phone: string;

  @MinLength(3)
  @IsString()
  @ApiProperty({ example: 'Минск' })
  rs_address: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '' })
  rs_telegramNickname: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '' })
  rs_viberPhone: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '' })
  rs_whatsappPhone: string;

  rs_isActivated: boolean;
}

export class QueryGetUserDto {
  @ApiProperty({ example: 5 })
  generations: number;
}

export class ResponseDataGetUserDto {
  @ApiProperty()
  rs_middlename: string;

  @ApiProperty()
  rs_name: string;

  @ApiProperty()
  rs_surname: string;

  @ApiProperty()
  rs_id: number;

  @ApiProperty()
  rs_ref: string;

  @ApiProperty()
  rs_address: string;

  @ApiProperty()
  rs_birthday: string;

  @ApiProperty()
  rs_email: string;

  @ApiProperty()
  rs_phone: string;

  @ApiProperty()
  rs_telegramNickname: string;

  @ApiProperty()
  rs_viberPhone: string;

  @ApiProperty()
  rs_whatsappPhone: string;

  @ApiProperty()
  rs_isActivated: boolean;

  @Exclude()
  rs_login: string;

  @Exclude()
  rs_passwordHash: string;
}

export class ResponseGetUserDto extends AppResponseDto {
  @ApiProperty({ type: ResponseDataGetUserDto })
  data: ResponseDataGetUserDto;
}

export class ResponseDataGetUserByIdDto {
  @ApiProperty()
  rs_middlename: string;

  @ApiProperty()
  rs_name: string;

  @ApiProperty()
  rs_surname: string;

  @ApiProperty()
  rs_id: number;

  @ApiProperty()
  rs_ref: string;

  @ApiProperty()
  rs_address: string;

  @ApiProperty()
  rs_birthday: string;

  @ApiProperty()
  rs_email: string;

  @ApiProperty()
  rs_phone: string;

  @ApiProperty()
  rs_telegramNickname: string;

  @ApiProperty()
  rs_viberPhone: string;

  @ApiProperty()
  rs_whatsappPhone: string;

  @ApiProperty()
  rs_isActivated: boolean;

  @Exclude()
  rs_login: string;

  @Exclude()
  rs_passwordHash: string;
}

export class ResponseGetUserByIdDto extends AppResponseDto {
  @ApiProperty({ type: ResponseDataGetUserByIdDto })
  data: ResponseDataGetUserByIdDto;
}

export class ResponseDataGetUserMyDataDto {
  @ApiProperty()
  rs_middlename: string;

  @ApiProperty()
  rs_name: string;

  @ApiProperty()
  rs_surname: string;

  @ApiProperty()
  rs_id: number;

  @ApiProperty()
  rs_ref: string;

  @ApiProperty()
  rs_address: string;

  @ApiProperty()
  rs_birthday: string;

  @ApiProperty()
  rs_email: string;

  @ApiProperty()
  rs_phone: string;

  @ApiProperty()
  rs_telegramNickname: string;

  @ApiProperty()
  rs_viberPhone: string;

  @ApiProperty()
  rs_whatsappPhone: string;

  @ApiProperty()
  rs_isActivated: boolean;

  @Exclude()
  rs_login: string;

  @Exclude()
  rs_passwordHash: string;
}

export class ResponseGetUserMyDataDto extends AppResponseDto {
  @ApiProperty({ type: ResponseDataGetUserByIdDto })
  data: ResponseDataGetUserByIdDto;
}

export class QueryUserForgetPasswordDto {
  @ApiProperty()
  rs_loginOrEmail: string;
}

export class QueryPatchUserDto {
  @Exclude()
  rs_id: number;

  @Exclude()
  rs_ref: number;

  @Exclude()
  rs_email: string;

  @Exclude()
  rs_login: string;

  @Exclude()
  rs_surname: string;

  @Exclude()
  rs_name: string;

  @Exclude()
  rs_middlename: string;

  @Exclude()
  rs_password: string;

  @Exclude()
  rs_birthday: string;

  @Exclude()
  rs_phone: string;

  @Exclude()
  rs_address: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '' })
  rs_telegramNickname: string;

  @IsOptional()
  @ApiProperty({ example: '' })
  rs_viberPhone: string;

  @IsOptional()
  @ApiProperty({ example: '' })
  rs_whatsappPhone: string;

  @Exclude()
  rs_isActivated: boolean;
}

export class QueryUserChangePasswordDto {
  @ApiProperty()
  rs_password: string;
}
