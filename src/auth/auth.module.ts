import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JWTConfig } from 'src/config/jwt.config';
import { UsersModule } from 'src/users/users.module';
import { JWTStrategy } from './JWT.strategy';

@Module({
  imports: [JwtModule.register(JWTConfig), UsersModule],
  providers: [AuthService, JWTStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
