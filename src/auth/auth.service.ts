import {
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDTO } from './DTO/login.DTO';
import { LoginResponse } from './interface/login-response.interface';
import { UsersService } from 'src/users/users.service';
import { Users } from 'src/users/entity/users.entity';
import { RefreshTokenConfig } from 'src/config/jwt.config';
import { RefreshAccessTokenDTO } from './DTO/refreshAccessToken.DTO';
import { TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    private readonly JWTService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async login(payload: LoginDTO): Promise<LoginResponse> {
    const { email, password } = payload;
    const user = await this.usersService.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException('Wrong Email Or Password');
    }

    const access_token = await this.createAccessToken(user);

    return {
      id: user.id,
      email: user.email,
      isVerified: user.isVerified,
      access_token: access_token.access_token,
      refresh_token: access_token.refresh_token,
    };
  }

  async createAccessToken(
    user: Users,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const payload = {
      sub: user.id,
    };

    const access_token = await this.JWTService.signAsync(payload);
    const refresh_token = await this.JWTService.signAsync(
      payload,
      RefreshTokenConfig,
    );

    return {
      access_token: access_token,
      refresh_token: refresh_token,
    };
  }

  async refreshAccessToken(
    valueToken: RefreshAccessTokenDTO,
  ): Promise<{ access_token: string }> {
    const { refresh_token } = valueToken;

    const payload = await this.decodeToken(refresh_token);

    const access_token = await this.createAccessToken({
      id: payload.sub,
    } as Users);

    return access_token;
  }

  async decodeToken(token: string): Promise<any> {
    try {
      return await this.JWTService.verifyAsync(token);
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Refresh Token Is Expired');
      } else {
        throw new InternalServerErrorException('Failed To Decode Token');
      }
    }
  }
}
