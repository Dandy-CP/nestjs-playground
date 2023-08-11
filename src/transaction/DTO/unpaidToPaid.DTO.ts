import { IsNotEmpty } from 'class-validator';

export class unpaidToPaidDTO {
  @IsNotEmpty()
  id_transaction: string;

  @IsNotEmpty()
  invoice: string;
}
