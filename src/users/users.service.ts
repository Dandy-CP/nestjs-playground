import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';

import { Users } from './entity/users.entity';

import { CreateUserDTO } from './DTO/createUser.dto';
import { FilterUsers } from './DTO/filterUsers.DTO';
import { UpdateUserDTO } from './DTO/updateUsers.DTO';
import { ChangePasswordUserDTO } from './DTO/changePassword.DTO';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async getUsers(
    params: FilterUsers,
    options: IPaginationOptions,
  ): Promise<Pagination<Users>> {
    const { id, name } = params;
    const queryBuilder = this.usersRepository.createQueryBuilder('users');

    if (id) {
      queryBuilder.where('users.id = :id', { id }).getOne();
      return await paginate<Users>(queryBuilder, options);
    }

    if (name) {
      queryBuilder.where({ name: ILike(`%${name}%`) }).getMany();
      return await paginate<Users>(queryBuilder, options);
    }

    queryBuilder.getMany();
    return await paginate<Users>(queryBuilder, options);
  }

  async registerNewUsers(
    payload: CreateUserDTO,
  ): Promise<{ message: string } | CreateUserDTO> {
    const { name, email, password, role } = payload;
    const saltValue = await bcrypt.genSalt();

    if (role !== 'Employee' && role !== 'Admin') {
      throw new ConflictException(`Role ${role} is not Allowed`);
    }

    await this.usersRepository
      .createQueryBuilder()
      .insert()
      .into(Users)
      .values({
        name: name,
        email: email,
        role: role,
        password: await bcrypt.hash(password, saltValue),
        salt: saltValue,
        isVerified: false,
      })
      .execute()
      .catch((error) => {
        if (error.code === '23505') {
          throw new ConflictException(`Email ${email} already used`);
        } else {
          throw new InternalServerErrorException(error);
        }
      });

    return {
      message: 'Success Signup',
      name: name,
      email: email,
    };
  }

  async validateUser(email: string, password: string): Promise<Users> {
    const UserInDB = await this.usersRepository
      .createQueryBuilder('users')
      .where('users.email = :email', { email })
      .getOne();

    if (UserInDB && (await UserInDB.validatePassword(password))) {
      return UserInDB;
    }
  }

  async findUserByID(id: string): Promise<Users> {
    const UserInDB = await this.usersRepository
      .createQueryBuilder('users')
      .where('users.id = :id', { id })
      .getOne();

    if (!UserInDB) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return UserInDB;
  }

  async deleteUser(id: string): Promise<{ message: string }> {
    const excuteDelete = await this.usersRepository
      .createQueryBuilder('users')
      .delete()
      .from(Users)
      .where('users.id = :id', { id })
      .execute();

    if (excuteDelete.affected === 0) {
      throw new NotFoundException(
        `User with ID ${id} not found or maybe deleted`,
      );
    }

    return {
      message: `user with id ${id} success deleted`,
    };
  }

  async updateUser(
    id: string,
    payload: UpdateUserDTO,
  ): Promise<{ message: string; value: UpdateUserDTO }> {
    const excuteUpdate = await this.usersRepository
      .createQueryBuilder('users')
      .update(Users)
      .set(payload)
      .where('users.id = :id', { id })
      .execute();

    if (excuteUpdate.affected === 0) {
      throw new NotFoundException(
        `User with ID ${id} not found or maybe deleted`,
      );
    }

    return {
      message: `user with id ${id} success updated`,
      value: payload,
    };
  }

  async changePassword(
    id: string,
    payload: ChangePasswordUserDTO,
  ): Promise<{ message: string }> {
    const { old_password, new_password } = payload;

    const UserInDB = await this.findUserByID(id);
    const checkPassword = await UserInDB.validatePassword(old_password);

    if (checkPassword) {
      const excuteChangePassword = await this.usersRepository
        .createQueryBuilder('users')
        .update(Users)
        .set({
          password: await bcrypt.hash(new_password, UserInDB.salt),
        })
        .where('users.id = :id', { id })
        .execute();

      if (excuteChangePassword.affected === 0) {
        throw new NotFoundException(
          `User with ID ${id} not found or maybe deleted`,
        );
      }
    } else if (!checkPassword) {
      throw new UnauthorizedException('Wrong old password');
    }

    return {
      message: `user with id ${id} success change password`,
    };
  }
}
