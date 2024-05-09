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
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  CreateUserDto,
  ForgetPasswordBodyDto,
  GetUserByIdResponseDto,
  GetUserResponseDto,
  GetUserTreeQuery,
} from './users.dto';
import { AppResponseDto } from 'src/types/app-response.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { VerifyAccessTokenGuard } from 'src/guards/verify-access-token.guard';

@ApiTags('api_v1_users')
@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Res() res, @Body() dto: CreateUserDto) {
    return this.usersService.create(res, dto);
  }

  @ApiResponse({
    status: 200,
    type: GetUserResponseDto,
  })
  @ApiResponse({
    status: 404,
    type: AppResponseDto,
  })
  @Get()
  findAll(@Res() res, @Query() query: GetUserTreeQuery) {
    return this.usersService.findAll(res, query);
  }

  @ApiResponse({
    status: 200,
    type: GetUserByIdResponseDto,
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
    type: GetUserByIdResponseDto,
  })
  @ApiResponse({
    status: 404,
    type: AppResponseDto,
  })
  @Get('x/activate-account/:activationToken')
  activateAccount(
    @Res() res,
    @Param('activationToken') activationToken: string,
  ) {
    return this.usersService.activateAccount(res, activationToken);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(VerifyAccessTokenGuard)
  @Get('x/my-data')
  findMyData(@Res() res, @Req() req) {
    return this.usersService.findMyData(res, req);
  }

  @Post('forget-password')
  forgetPassword(@Res() res, @Body() body: ForgetPasswordBodyDto) {
    return this.usersService.forgetPassword(res, body);
  }
}
