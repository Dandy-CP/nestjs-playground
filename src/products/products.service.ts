import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDTO } from './DTO/createProduct.DTO';
import { UpdateProductDTO } from './DTO/updateProduct.DTO';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entity/product.entity';
import { FilterProductDTO } from './DTO/filterProducts.DTO';
import { Repository, ILike } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async getProducts(params: FilterProductDTO): Promise<Product[] | any> {
    const { productName, category } = params;

    if (productName) {
      return {
        totalProducts: await this.productRepository
          .createQueryBuilder('product')
          .where({ productName: ILike(`%${productName}%`) })
          .getCount(),
        value: await this.productRepository
          .createQueryBuilder('product')
          .where({ productName: ILike(`%${productName}%`) })
          .getMany(),
      };
    }

    if (category) {
      return {
        totalProducts: await this.productRepository
          .createQueryBuilder('product')
          .where({ category: ILike(`%${category}%`) })
          .getCount(),
        value: await this.productRepository
          .createQueryBuilder('product')
          .where({ category: ILike(`%${category}%`) })
          .getMany(),
      };
    }

    return {
      totalProducts: await this.productRepository
        .createQueryBuilder('product')
        .getCount(),
      value: await this.productRepository
        .createQueryBuilder('product')
        .getMany(),
    };
  }

  async getProductById(id: string): Promise<Product[] | any> {
    const valueProduct = await this.productRepository
      .createQueryBuilder('product')
      .where('product.id = :id', { id })
      .getOne();

    if (!valueProduct) {
      throw new NotFoundException(`Data dengan ID ${id} tidak di temukan`);
    }

    return valueProduct;
  }

  async createProduct(payload: CreateProductDTO): Promise<Product | any> {
    await this.productRepository
      .createQueryBuilder()
      .insert()
      .into(Product)
      .values(payload)
      .execute();

    return {
      message: 'product created',
      data: payload,
    };
  }

  async deleteProduct(id: string): Promise<any> {
    const valueProduct = await this.productRepository
      .createQueryBuilder('product')
      .delete()
      .from(Product)
      .where('product.id = :id', { id })
      .execute();

    if (valueProduct.affected === 0) {
      throw new NotFoundException(
        `Data dengan ID ${id} tidak di temukan, atau sudah terhapus`,
      );
    }

    return {
      message: `product delete with id ${id} success`,
    };
  }

  async updateProduct(
    id: string,
    payload: UpdateProductDTO,
  ): Promise<Product[] | any> {
    const valueProduct = await this.productRepository
      .createQueryBuilder('product')
      .update(Product)
      .set(payload)
      .where('product.id = :id', { id })
      .execute();

    if (valueProduct.affected === 0) {
      throw new NotFoundException(
        `Data dengan ID ${id} tidak di temukan, atau sudah terhapus`,
      );
    }

    return {
      message: 'Updated success',
      value: payload,
    };
  }
}
