import {
  Injectable,
  InternalServerErrorException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Repository, ILike } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';

import { Transaction } from './entity/transaction.entity';
import { Product } from 'src/products/entity/product.entity';

import { CreateTransactionDTO } from './DTO/createTransaction.DTO';
import { FilterTransactionDTO } from './DTO/filterTransaction.DTO';
import { TransactionItemsDTO } from './DTO/transaction.DTO';
import { unpaidToPaidDTO } from './DTO/unpaidToPaid.DTO';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async getTransaction(
    params: FilterTransactionDTO,
    options: IPaginationOptions,
  ): Promise<Pagination<Transaction>> {
    const { buyerName, shippingMethode, invoice } = params;
    const queryBuilder =
      this.transactionRepository.createQueryBuilder('transaction');

    if (buyerName) {
      queryBuilder.where({ buyerName: ILike(`%${buyerName}%`) }).getMany();
      return await paginate<Transaction>(queryBuilder, options);
    }

    if (shippingMethode) {
      queryBuilder
        .where({ shippingMethode: ILike(`%${shippingMethode}%`) })
        .getMany();
      return await paginate<Transaction>(queryBuilder, options);
    }

    if (invoice) {
      queryBuilder.where({ invoice: invoice }).getMany();
      return await paginate<Transaction>(queryBuilder, options);
    }

    queryBuilder.getMany();
    return await paginate<Transaction>(queryBuilder, options);
  }

  async createTransaction(
    payload: CreateTransactionDTO,
  ): Promise<Transaction | { message: string; data: any }> {
    const {
      buyerName,
      addressBuyer,
      items,
      shippingMethode,
      isPaid,
      paymentMethode,
    } = payload;

    if (
      paymentMethode !== 'Cash' &&
      paymentMethode !== 'Transfer Bank' &&
      paymentMethode !== 'Kredit' &&
      paymentMethode !== 'Debit' &&
      paymentMethode !== 'QR' &&
      paymentMethode !== 'E-commerce'
    ) {
      throw new ConflictException(
        `Payment Methode ${paymentMethode} is not Allowed`,
      );
    }

    if (
      shippingMethode !== 'OUTLET' &&
      shippingMethode !== 'JNE' &&
      shippingMethode !== 'JNT' &&
      shippingMethode !== 'SI CEPAT'
    ) {
      throw new ConflictException(
        `shipping Methode ${shippingMethode} is not Allowed`,
      );
    }

    const checkProduct = await this.checkProductAvailabilityInDB(items);

    if (checkProduct.isHasEmptyStock === true) {
      throw new InternalServerErrorException(
        `Stock Product ${checkProduct.products.map(
          (value) => value.productName,
        )} kosong`,
      );
    }

    const PricePerItems = items.map((data) => {
      return data.price * data.quantity;
    });

    const valueTotalPrice = PricePerItems.reduce(
      (currentValue, currentIndex) => {
        return currentValue + currentIndex;
      },
    );

    const getRandomId = (min = 0, max = 1000000) => {
      min = Math.ceil(min);
      max = Math.floor(max);
      const num = Math.floor(Math.random() * (max - min + 1)) + min;
      return num.toString().padStart(7, '0');
    };

    if (isPaid === true) {
      await this.paidPayment(items);
    }

    await this.transactionRepository
      .createQueryBuilder()
      .insert()
      .into(Transaction)
      .values({
        buyerName: buyerName,
        addressBuyer: addressBuyer,
        shippingMethode: shippingMethode,
        items: items,
        totalPrice: valueTotalPrice,
        invoice: `INV-${getRandomId()}`,
        isPaid: isPaid,
        paymentMethode: paymentMethode,
      })
      .execute()
      .catch((error) => {
        throw new InternalServerErrorException(error);
      });

    return {
      message: 'Transaction Created',
      data: {
        buyerName: buyerName,
        addressBuyer: addressBuyer,
        shippingMethode: shippingMethode,
        items: items,
        totalPrice: valueTotalPrice,
        invoice: `INV-${getRandomId()}`,
      },
    };
  }

  async checkProductAvailabilityInDB(
    items: TransactionItemsDTO[],
  ): Promise<{ isHasEmptyStock: boolean; products: Product[] }> {
    const CheckOutItemsProcuctID = items.map((data) => {
      return data.idProduct;
    });

    const productInDB = await this.productRepository
      .createQueryBuilder('product')
      .where('product.id IN (:...id)', { id: CheckOutItemsProcuctID })
      .getMany();

    const checkStockProductInDB = productInDB.filter(
      (data) => data.stock === 0,
    );

    if (checkStockProductInDB.length !== 0) {
      return {
        isHasEmptyStock: true,
        products: checkStockProductInDB,
      };
    } else {
      return {
        isHasEmptyStock: false,
        products: checkStockProductInDB,
      };
    }
  }

  async paidPayment(
    items: TransactionItemsDTO[],
  ): Promise<{ message: string }> {
    items.map(async (data) => {
      await this.productRepository
        .createQueryBuilder('product')
        .update(Product)
        .set({
          stock: () => `stock - ${data.quantity}`,
        })
        .where('product.id = :id', { id: data.idProduct })
        .execute()
        .catch((error) => {
          throw new InternalServerErrorException(error);
        });
    });

    return {
      message: 'Payment Success',
    };
  }

  async unPaidToPaidPayment(
    payload: unpaidToPaidDTO,
  ): Promise<{ message: string }> {
    const { invoice, id_transaction } = payload;

    const queryBuilder =
      this.transactionRepository.createQueryBuilder('transaction');

    const valueTransactionInDB = await queryBuilder
      .where({
        id: id_transaction,
        invoice: invoice,
      })
      .getOne();

    if (valueTransactionInDB === null) {
      throw new NotFoundException(`Data with ID ${invoice} not found`);
    } else if (valueTransactionInDB.isPaid === true) {
      throw new ConflictException(
        `Payment with invoice ${invoice} status has been paid`,
      );
    }

    valueTransactionInDB.items.map(async (data) => {
      await this.productRepository
        .createQueryBuilder('product')
        .update(Product)
        .set({
          stock: () => `stock - ${data.quantity}`,
        })
        .where('product.id = :id', { id: data.idProduct })
        .execute()
        .catch((error) => {
          throw new InternalServerErrorException(error);
        });
    });

    await queryBuilder
      .update(Transaction)
      .set({
        isPaid: true,
      })
      .where('transaction.id = :id', { id: id_transaction })
      .execute();

    return {
      message: 'Product Paid Success',
    };
  }
}
