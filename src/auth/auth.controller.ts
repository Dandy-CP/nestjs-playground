import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './DTO/login.DTO';
import { LoginResponse } from './interface/login-response.interface';
import { RefreshAccessTokenDTO } from './DTO/refreshAccessToken.DTO';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() payload: LoginDTO): Promise<LoginResponse> {
    return this.authService.login(payload);
  }

  @Post('refresh-token')
  async RefreshToken(
    @Body() payload: RefreshAccessTokenDTO,
  ): Promise<{ access_token: string }> {
    return this.authService.refreshAccessToken(payload);
  }
}
