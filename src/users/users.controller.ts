import {
  Body,
  Controller,
  Delete,
  Get,
  Put,
  Param,
  Post,
  Query,
  UseGuards,
  UnauthorizedException,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { JWTGuard } from 'guard/JWT.guard';
import { UUIDValidation } from 'src/pipes/uuid-validation.pipe';
import { GetUser } from 'src/auth/user.decorator';
import { UsersService } from './users.service';
import { Users } from './entity/users.entity';

import { CreateUserDTO } from './DTO/createUser.dto';
import { FilterUsers } from './DTO/filterUsers.DTO';
import { UpdateUserDTO } from './DTO/updateUsers.DTO';
import { ChangePasswordUserDTO } from './DTO/changePassword.DTO';

@Controller('user')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  @UseGuards(JWTGuard)
  async getAllUsers(
    @Query() params: FilterUsers,
    @GetUser() logedInUser: Users,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<Pagination<Users>> {
    limit = limit > 100 ? 100 : limit;

    if (logedInUser.role === 'Admin') {
      return this.userService.getUsers(params, {
        page,
        limit,
      });
    } else {
      throw new UnauthorizedException('Only Admin can access this route');
    }
  }

  @Delete('/:id')
  @UseGuards(JWTGuard)
  async deleteUser(
    @Param('id', UUIDValidation) id: string,
    @GetUser() logedInUser: Users,
  ): Promise<{ message: string }> {
    if (logedInUser.role === 'Admin') {
      return this.userService.deleteUser(id);
    } else {
      throw new UnauthorizedException('Only Admin can access this route');
    }
  }

  @Put('/:id')
  @UseGuards(JWTGuard)
  async updateUser(
    @Param('id', UUIDValidation) id: string,
    @Body() payload: UpdateUserDTO,
  ): Promise<{ message: string; value: UpdateUserDTO }> {
    return this.userService.updateUser(id, payload);
  }

  @Put('change-password/:id')
  @UseGuards(JWTGuard)
  async changePassword(
    @Param('id') id: string,
    @Body() payload: ChangePasswordUserDTO,
  ): Promise<{ message: string }> {
    return this.userService.changePassword(id, payload);
  }

  @Post('/register')
  async registerNewUser(
    @Body() payload: CreateUserDTO,
  ): Promise<{ message: string } | CreateUserDTO> {
    return this.userService.registerNewUsers(payload);
  }
}
