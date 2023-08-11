import { IsNotEmpty, IsOptional } from 'class-validator';

export class TransactionItemsDTO {
  @IsNotEmpty()
  idProduct: string;

  @IsNotEmpty()
  productName: string;

  @IsNotEmpty()
  quantity: number;

  @IsNotEmpty()
  price: number;

  @IsOptional()
  notes: string;
}
