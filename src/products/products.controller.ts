import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Param,
  Query,
  Delete,
  UseGuards,
  DefaultValuePipe,
  ParseIntPipe,
  // UsePipes,
  // ValidationPipe,
} from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';

import { ProductsService } from './products.service';
import { UUIDValidation } from 'src/pipes/uuid-validation.pipe';
import { JWTGuard } from 'guard/JWT.guard';
import { Product } from './entity/product.entity';
import { CreateProductDTO } from './DTO/createProduct.DTO';
import { UpdateProductDTO } from './DTO/updateProduct.DTO';
import { FilterProductDTO } from './DTO/filterProducts.DTO';

@Controller('products')
@UseGuards(JWTGuard)
export class ProductsController {
  constructor(private productService: ProductsService) {}

  @Get()
  async getProducts(
    @Query() params: FilterProductDTO,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<Pagination<Product>> {
    limit = limit > 100 ? 100 : limit;

    return this.productService.getProducts(params, {
      page,
      limit,
    });
  }

  @Get('/:id')
  async getProductsById(
    @Param('id', UUIDValidation) id: string,
  ): Promise<void> {
    return this.productService.getProductById(id);
  }

  @Post()
  // @UsePipes(ValidationPipe) //Route Validation Pipes
  async createProducts(@Body() payload: CreateProductDTO): Promise<void> {
    return this.productService.createProduct(payload);
  }

  @Delete('/:id')
  async deleteProducts(@Param('id', UUIDValidation) id: string): Promise<void> {
    return this.productService.deleteProduct(id);
  }

  @Put('/:id')
  async updateProduct(
    @Param('id', UUIDValidation) id: string,
    @Body() payload: UpdateProductDTO,
  ): Promise<void> {
    return this.productService.updateProduct(id, payload);
  }
}
