import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { TransactionItemsDTO } from '../DTO/transaction.DTO';

@Entity()
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  buyerName: string;

  @Column()
  addressBuyer: string;

  @Column()
  shippingMethode: string;

  @Column({ type: 'json' })
  items: TransactionItemsDTO[];

  @Column()
  totalPrice: number;

  @Column()
  invoice: string;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  buyDate: Date;

  @Column()
  isPaid: boolean;

  @Column()
  paymentMethode: string;
}
