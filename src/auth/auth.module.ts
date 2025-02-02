import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrentUserInterceptor } from 'src/interceptors/current-user.interceptor';
import { UserService } from 'src/user/user.service';
import { User } from '../user/entity/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    { provide: APP_INTERCEPTOR, useClass: CurrentUserInterceptor },
  ],
})
export class AuthModule {}
