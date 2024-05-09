import * as path from 'path';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import RS_CTL_Users from 'src/entities/RS_CTL_Users.entity';
import { SessionsModule } from '../sessions/sessions.module';
import { RS_DOC_ActivationAccount } from 'src/entities/RS_DOC_ActivationAccount.entity';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    TypeOrmModule.forFeature([RS_CTL_Users, RS_DOC_ActivationAccount]),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('APP__EMAIL_HOST'),
          port: configService.get<number>('APP__EMAIL_PORT'),
          auth: {
            user: configService.get<string>('APP__EMAIL_USER'),
            pass: configService.get<string>('APP__EMAIL_PASS'),
          },
        },
        defaults: {
          from: `${configService.get<string>('APP__EMAIL_NAME')} <${configService.get<string>('APP__EMAIL_USER')}>`,
        },
        template: {
          dir: path.join(__dirname, '../../..', 'templates'),
          adapter: new HandlebarsAdapter(),
        },
      }),
    }),
    SessionsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
