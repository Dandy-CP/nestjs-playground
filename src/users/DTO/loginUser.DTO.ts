import { IsNotEmpty, IsEmail, MinLength } from 'class-validator';

export class LoginUsersDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
