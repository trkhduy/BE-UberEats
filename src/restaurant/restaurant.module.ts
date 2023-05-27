import { Module, forwardRef } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { RestaurantController } from './restaurant.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { UserModule } from 'src/user/user.module';
import { ProductModule } from 'src/product/product.module';
import { UserAddressModule } from 'src/user_address/user_address.module';


@Module({
  imports: [TypeOrmModule.forFeature([Restaurant]),
  forwardRef(() => UserModule),
  ],

  controllers: [RestaurantController],
  providers: [RestaurantService],
  exports: [TypeOrmModule]
})
export class RestaurantModule { }
