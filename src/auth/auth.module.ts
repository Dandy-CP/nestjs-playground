import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JWTConfig } from 'src/config/jwt.config';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [JwtModule.register(JWTConfig), UsersModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
