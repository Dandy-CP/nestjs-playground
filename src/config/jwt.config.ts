import { JwtModuleOptions, JwtSignOptions } from '@nestjs/jwt';

export const JWTConfig: JwtModuleOptions = {
  secret: 'd1W1gPqVvpSdix3cXuSGkNs6JObGKyspUerBKIODC8x15CvWnETkjhj9P1YaerT',
  signOptions: {
    expiresIn: '2 days',
  },
};

export const RefreshTokenConfig: JwtSignOptions = {
  expiresIn: '7 days',
};
