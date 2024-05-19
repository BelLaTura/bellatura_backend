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

export class CreateUserDto {
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

  rs_isActivated: boolean;
}

export class GetUserTreeQuery {
  @ApiProperty({ example: 5 })
  generations: number;

  @ApiProperty({ example: 1 })
  id: number;
}

export class PublicUserDto {
  @ApiProperty()
  rs_id: number;

  @ApiProperty()
  rs_initials_name: string;

  @ApiProperty()
  rs_ref: number;
}

export class GetUserResponseDto extends AppResponseDto {
  @ApiProperty({ type: [PublicUserDto] })
  data: PublicUserDto[];
}

export class GetUserByIdResponseDto extends AppResponseDto {
  @ApiProperty({ type: PublicUserDto })
  data: PublicUserDto;
}

export class ForgetPasswordBodyDto {
  rs_loginOrEmail: string;
}

export class PatchUserDto {
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

  @Exclude()
  rs_isActivated: boolean;
}