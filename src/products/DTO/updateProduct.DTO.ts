import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateProductDTO {
  @IsNotEmpty()
  productName: string;

  @IsNotEmpty()
  category: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsNumber()
  stock: number;
}
