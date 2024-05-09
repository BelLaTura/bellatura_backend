import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionsService } from './sessions.service';
import { SessionsController } from './sessions.controller';
import RS_CTL_Users from 'src/entities/RS_CTL_Users.entity';
import { RS_DOC_Sessions } from 'src/entities/RS_DOC_Sessions.entity';

@Module({
  controllers: [SessionsController],
  providers: [SessionsService],
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([RS_DOC_Sessions, RS_CTL_Users]),
  ],
  exports: [SessionsService],
})
export class SessionsModule {}
