import * as path from 'path';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { APIv1 } from './api/v1/APIv1.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [path.join('dist', '**', '*.entity.js')],
      logging: true,
      // logger: 'file',
      synchronize: false,
    }),
    APIv1,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
