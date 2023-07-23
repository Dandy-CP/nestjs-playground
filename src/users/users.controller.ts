import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from './DTO/createUser.dto';

@Controller('user')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post('/register')
  async registerNewUser(
    @Body() payload: CreateUserDTO,
  ): Promise<{ message: string } | CreateUserDTO> {
    return this.userService.registerNewUsers(payload);
  }
}
