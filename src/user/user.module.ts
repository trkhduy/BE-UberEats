import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { MulterModule } from '@nestjs/platform-express';
import { OrderModule } from 'src/oder/order.module';
import { CartModule } from 'src/cart/cart.module';
import { UserController } from './user.controller';
import { RestaurantModule } from 'src/restaurant/restaurant.module';
import { UserAddressModule } from 'src/user_address/user_address.module';

@Module({
  imports: [TypeOrmModule.forFeature([User],),
  MulterModule.register({ dest: './upload' }),
  forwardRef(() => OrderModule),
  forwardRef(() => RestaurantModule),
  forwardRef(() => UserAddressModule),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [TypeOrmModule]
})
export class UserModule { }
