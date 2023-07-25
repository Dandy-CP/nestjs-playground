import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JWTConfig } from 'src/config/jwt.config';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWTConfig.secret,
    });
  }

  async validate(payload: any) {
    const user = await this.userService.findUserByID(payload.sub);

    if (!user) {
      throw new UnauthorizedException(`user not found`);
    }

    return user;
  }
}
