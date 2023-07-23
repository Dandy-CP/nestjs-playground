import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { typeOrmConfig } from './config/typeorm.config';
import { UsersModule } from './users/users.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), ProductsModule, UsersModule],
})
export class AppModule {}
