import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Param,
  Query,
  Delete,
  // UsePipes,
  // ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from './DTO/createUser.dto';
import { LoginUsersDTO } from './DTO/loginUser.DTO';

@Controller('user')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get('/login')
  async loginUser(@Body() payload: LoginUsersDTO): Promise<void> {
    return this.userService.loginUsers(payload);
  }

  @Post('/register')
  async registerNewUser(@Body() payload: CreateUserDTO): Promise<void> {
    return this.userService.registerNewUsers(payload);
  }
}
