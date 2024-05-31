import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Res,
  Query,
  UseGuards,
  Req,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  QueryCreateUserDto,
  QueryUserForgetPasswordDto,
  ResponseGetUserByIdDto,
  ResponseGetUserMyDataDto,
  QueryGetUserDto,
  QueryPatchUserDto,
  ResponseGetUserDto,
  QueryUserChangePasswordDto,
} from './users.dto';
import { AppResponseDto } from 'src/types/app-response.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { VerifyAccessTokenGuard } from 'src/guards/verify-access-token.guard';

@ApiTags('api_v1_users')
@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiResponse({
    status: 200,
    type: AppResponseDto,
  })
  @ApiResponse({
    status: 409,
    type: AppResponseDto,
  })
  @Post()
  create(@Res() res, @Body() dto: QueryCreateUserDto) {
    return this.usersService.create(res, dto);
  }

  @ApiResponse({
    status: 200,
    type: ResponseGetUserDto,
  })
  @ApiResponse({
    status: 401,
    type: AppResponseDto,
  })
  @ApiResponse({
    status: 404,
    type: AppResponseDto,
  })
  @ApiBearerAuth('access-token')
  @UseGuards(VerifyAccessTokenGuard)
  @Get()
  findAll(@Res() res, @Query() query: QueryGetUserDto, @Req() req) {
    return this.usersService.findAll(res, query, req);
  }

  @ApiResponse({
    status: 200,
    type: ResponseGetUserByIdDto,
  })
  @ApiResponse({
    status: 404,
    type: AppResponseDto,
  })
  @Get(':id')
  findOne(@Res() res, @Param('id') id: string) {
    return this.usersService.findOne(res, +id);
  }

  @ApiResponse({
    status: 200,
    type: String,
  })
  @ApiResponse({
    status: 404,
    type: AppResponseDto,
  })
  @ApiResponse({
    status: 409,
    type: String,
  })
  @Get('x/activate-account/:activationToken')
  activateAccount(
    @Res() res,
    @Param('activationToken') activationToken: string,
  ) {
    return this.usersService.activateAccount(res, activationToken);
  }

  @ApiResponse({
    status: 200,
    type: AppResponseDto,
  })
  @ApiResponse({
    status: 401,
    type: AppResponseDto,
  })
  @ApiResponse({
    status: 409,
    type: AppResponseDto,
  })
  @ApiBearerAuth('access-token')
  @UseGuards(VerifyAccessTokenGuard)
  @Post('x/activate-account')
  getNewActivationAccount(@Res() res, @Req() req) {
    return this.usersService.getNewActivationAccout(res, req);
  }

  @ApiResponse({
    status: 200,
    type: ResponseGetUserMyDataDto,
  })
  @ApiResponse({
    status: 401,
    type: AppResponseDto,
  })
  @ApiBearerAuth('access-token')
  @UseGuards(VerifyAccessTokenGuard)
  @Get('x/my-data')
  findMyData(@Res() res, @Req() req) {
    return this.usersService.findMyData(res, req);
  }

  @ApiResponse({
    status: 200,
    type: AppResponseDto,
  })
  @ApiResponse({
    status: 409,
    type: AppResponseDto,
  })
  @Post('x/forget-password')
  forgetPassword(@Res() res, @Body() body: QueryUserForgetPasswordDto) {
    return this.usersService.forgetPassword(res, body);
  }

  @ApiResponse({
    status: 200,
    type: AppResponseDto,
  })
  @ApiResponse({
    status: 401,
    type: AppResponseDto,
  })
  @ApiBearerAuth('access-token')
  @UseGuards(VerifyAccessTokenGuard)
  @Patch()
  patchUser(@Res() res, @Body() body: QueryPatchUserDto, @Req() req) {
    return this.usersService.patchUser(res, body, req);
  }

  @ApiResponse({
    status: 200,
    type: AppResponseDto,
  })
  @ApiResponse({
    status: 401,
    type: AppResponseDto,
  })
  @Patch('x/change-password')
  changePassword(
    @Res() res,
    @Body() body: QueryUserChangePasswordDto,
    @Req() req,
  ) {
    return this.usersService.changePassword(res, body, req);
  }
}
