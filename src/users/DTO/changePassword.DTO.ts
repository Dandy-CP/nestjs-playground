import { IsNotEmpty, MinLength } from 'class-validator';

export class ChangePasswordUserDTO {
  @IsNotEmpty()
  @MinLength(8)
  old_password: string;

  @IsNotEmpty()
  @MinLength(8)
  new_password: string;
}
