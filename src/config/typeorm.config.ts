import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'adminroot',
  database: 'nestjs_playground',
  entities: [__dirname + '/../**/*.entity.{ts,js}'],
  synchronize: true,
};
