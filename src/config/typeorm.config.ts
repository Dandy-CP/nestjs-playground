import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import 'dotenv/config';

// --- Aiven
export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [__dirname + '/../**/*.entity.{ts,js}'],
  ssl: {
    ca: process.env.SSL_CA_CERTIFICATES,
    rejectUnauthorized: false,
  },
  synchronize: true,
};

// --- ElephantSQL
// export const typeOrmConfig: TypeOrmModuleOptions = {
//   type: 'postgres',
//   host: 'topsy.db.elephantsql.com',
//   port: 5432,
//   username: 'vlmhanuw',
//   password: '8LjVcfaeOIn1RlLdMR1n_XmhF4BiYSjV',
//   database: 'vlmhanuw',
//   entities: [__dirname + '/../**/*.entity.{ts,js}'],
//   synchronize: true,
// };

// --- Local
// export const typeOrmConfig: TypeOrmModuleOptions = {
//   type: 'postgres',
//   host: 'localhost',
//   port: 5432,
//   username: 'postgres',
//   password: 'adminroot',
//   database: 'nestjs_playground',
//   entities: [__dirname + '/../**/*.entity.{ts,js}'],
//   synchronize: true,
// };
