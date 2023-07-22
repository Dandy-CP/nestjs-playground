import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Param,
  Query,
  Delete,
  // UsePipes,
  // ValidationPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDTO } from './DTO/createProduct.DTO';
import { UpdateProductDTO } from './DTO/updateProduct.DTO';
import { FilterProductDTO } from './DTO/filterProducts.DTO';
import { UUIDValidation } from 'src/pipes/uuid-validation.pipe';

@Controller('products')
export class ProductsController {
  constructor(private productService: ProductsService) {}

  @Get()
  async getProducts(@Query() params: FilterProductDTO): Promise<void> {
    return this.productService.getProducts(params);
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
