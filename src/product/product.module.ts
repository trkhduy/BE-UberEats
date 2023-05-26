import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';

import { RestaurantModule } from 'src/restaurant/restaurant.module';
import { CategoryModule } from 'src/category/category.module';
import { CartModule } from 'src/cart/cart.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product]),
    UserModule,
    RestaurantModule,
    CategoryModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [TypeOrmModule]
})
export class ProductModule { }
