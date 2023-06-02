import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { RestaurantModule } from './restaurant/restaurant.module';

import { VoucherModule } from './voucher/voucher.module';
import { UserAddressModule } from './user_address/user_address.module';
import { ProductModule } from './product/product.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { OrderModule } from './oder/order.module';
import { StatusOderModule } from './status_oder/status_oder.module';
import { CartModule } from './cart/cart.module';
import { OrderdetailModule } from './orderdetail/orderdetail.module';
import { ConfigModule } from '@nestjs/config';
import { OrderUpdateModule } from './order-update/order-update.module';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'uber',
      autoLoadEntities: true,
      synchronize: true,
    }),
    UserModule,
    RestaurantModule,
    VoucherModule,
    UserAddressModule,
    ProductModule,
    AuthModule,
    CategoryModule,
    OrderModule,
    StatusOderModule,
    CartModule,
    OrderdetailModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true
    }),
    // OrderUpdateModule,
    OrderUpdateModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
