import { IsNotEmpty } from 'class-validator';

export class RefreshAccessTokenDTO {
  @IsNotEmpty()
  refresh_token: string;
}
