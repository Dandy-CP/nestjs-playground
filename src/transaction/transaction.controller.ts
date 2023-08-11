import {
  Controller,
  UseGuards,
  Post,
  Body,
  Get,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { JWTGuard } from 'guard/JWT.guard';
import { TransactionService } from './transaction.service';
import { CreateTransactionDTO } from './DTO/createTransaction.DTO';
import { FilterTransactionDTO } from './DTO/filterTransaction.DTO';
import { Transaction } from './entity/transaction.entity';
import { unpaidToPaidDTO } from './DTO/unpaidToPaid.DTO';

@Controller('transaction')
@UseGuards(JWTGuard)
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @Get()
  async getTransaction(
    @Query() params: FilterTransactionDTO,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<Pagination<Transaction>> {
    limit = limit > 100 ? 100 : limit;

    return this.transactionService.getTransaction(params, {
      page,
      limit,
    });
  }

  @Post()
  async createTransaction(
    @Body() payload: CreateTransactionDTO,
  ): Promise<Transaction | { message: string; data: any }> {
    return this.transactionService.createTransaction(payload);
  }

  @Post('/unpaid-to-paid')
  async unPaidToPaidTransaction(
    @Body() payload: unpaidToPaidDTO,
  ): Promise<{ message: string }> {
    return this.transactionService.unPaidToPaidPayment(payload);
  }
}
