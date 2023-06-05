import { Module } from '@nestjs/common';
import { VoucherService } from './voucher.service';
import { VoucherController } from './voucher.controller';
import { Voucher } from './entities/voucher.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantModule } from 'src/restaurant/restaurant.module';
import { UserModule } from 'src/user/user.module';
import { OrderUpdateGateway } from 'src/order-update/order-update.gateway';
import { OrderUpdateModule } from 'src/order-update/order-update.module';



@Module({
  imports: [
    TypeOrmModule.forFeature([Voucher]),
    UserModule,
    OrderUpdateModule
  ],
  controllers: [VoucherController],
  providers: [VoucherService]
})
export class VoucherModule { }
