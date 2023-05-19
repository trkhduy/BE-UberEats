import { Module, forwardRef } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { UserModule } from 'src/user/user.module';
import { StatusOderModule } from 'src/status_oder/status_oder.module';
import { RestaurantModule } from 'src/restaurant/restaurant.module';
import { Product } from 'src/product/entities/product.entity';
import { ProductModule } from 'src/product/product.module';
import { OrderDetail } from './entities/order_detail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order,OrderDetail]),
  forwardRef(() => UserModule),
    StatusOderModule,
    RestaurantModule,
    ProductModule

  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [TypeOrmModule]
})
export class OrderModule { }
