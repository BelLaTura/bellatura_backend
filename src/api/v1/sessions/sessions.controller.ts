import { Response } from 'express';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Res,
  UseGuards,
  Put,
} from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { CreateSessionBodyDto } from './sessions.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { VerifyAccessTokenGuard } from 'src/guards/verify-access-token.guard';

@ApiTags('api_v1_sessions')
@Controller('api/v1/sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post()
  create(@Body() body: CreateSessionBodyDto, @Req() req, @Res() res) {
    return this.sessionsService.create(body, req, res);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(VerifyAccessTokenGuard)
  @Post('x/is-verify')
  isVerify(@Res() res) {
    return this.sessionsService.isVerify(res);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(VerifyAccessTokenGuard)
  @Get()
  findAll(@Req() req, @Res() res: Response) {
    return this.sessionsService.findAll(req, res);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(VerifyAccessTokenGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req, @Res() res: Response) {
    return this.sessionsService.findOne(+id, req, res);
  }

  @ApiBearerAuth('refresh-token')
  @UseGuards(VerifyAccessTokenGuard)
  @Put()
  update(@Req() req, @Res() res: Response) {
    return this.sessionsService.update(req, res);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(VerifyAccessTokenGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req, @Res() res: Response) {
    return this.sessionsService.remove(+id, req, res);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(VerifyAccessTokenGuard)
  @Delete()
  removeAll(@Req() req, @Res() res: Response) {
    return this.sessionsService.removeAll(req, res);
  }
}
