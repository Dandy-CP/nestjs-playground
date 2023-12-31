import { IsNotEmpty, IsEmail, MinLength } from 'class-validator';

export class CreateUserDTO {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  role: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
