import { IsNotEmpty, IsEmail } from 'class-validator';

export class UpdateUserDTO {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
