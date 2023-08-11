import { IsNotEmpty, IsOptional } from 'class-validator';
import { TransactionItemsDTO } from '../DTO/transaction.DTO';

export class CreateTransactionDTO {
  @IsNotEmpty()
  buyerName: string;

  @IsNotEmpty()
  addressBuyer: string;

  @IsNotEmpty()
  shippingMethode: string;

  @IsNotEmpty()
  items: TransactionItemsDTO[];

  @IsOptional()
  totalPrice: number;

  @IsOptional()
  invoice: string;

  @IsNotEmpty()
  isPaid: boolean;

  @IsOptional()
  paymentMethode: string;
}
