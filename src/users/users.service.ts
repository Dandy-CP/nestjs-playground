import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Users } from './entity/users.entity';
import { CreateUserDTO } from './DTO/createUser.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async registerNewUsers(
    payload: CreateUserDTO,
  ): Promise<{ message: string } | CreateUserDTO> {
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
}
