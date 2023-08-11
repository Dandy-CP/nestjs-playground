import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { Transaction } from './entity/transaction.entity';
import { Product } from 'src/products/entity/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, Product])],
  providers: [TransactionService],
  controllers: [TransactionController],
})
export class TransactionModule {}
