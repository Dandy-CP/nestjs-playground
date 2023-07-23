import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Users } from './entity/users.entity';
import { CreateUserDTO } from './DTO/createUser.dto';
import { LoginUsersDTO } from './DTO/loginUser.DTO';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async loginUsers(payload: LoginUsersDTO): Promise<Users | any> {
    const { email, password } = payload;

    const UserInDB = await this.usersRepository
      .createQueryBuilder('users')
      .where('users.email = :email', { email })
      .getOne();

    if (UserInDB === null) {
      throw new NotFoundException(`Email ${email} tidak di temukan atau salah`);
    }

    if (UserInDB !== null) {
      const passwordValidation = await bcrypt.compare(
        password,
        UserInDB.password,
      );

      if (passwordValidation) {
        return {
          message: 'Login Success',
        };
      }

      if (!passwordValidation) {
        return {
          message: 'Wrong Password',
        };
      }
    }
  }

  async registerNewUsers(payload: CreateUserDTO): Promise<Users | any> {
    const { name, email, password } = payload;
    const saltValue = await bcrypt.genSalt();

    await this.usersRepository
      .createQueryBuilder()
      .insert()
      .into(Users)
      .values({
        name: name,
        email: email,
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
      message: 'user created',
    };
  }
}
