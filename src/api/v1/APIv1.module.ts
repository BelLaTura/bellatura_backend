import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { SessionsModule } from './sessions/sessions.module';

@Module({
  imports: [UsersModule, SessionsModule],
})
export class APIv1 {}
