import { Module, forwardRef } from '@nestjs/common';
import { UserAddressService } from './user_address.service';
import { UserAddressController } from './user_address.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAddress } from './entities/user_address.entity';
import { UserModule } from 'src/user/user.module';
import { OrderModule } from 'src/oder/order.module';


@Module({
  imports: [TypeOrmModule.forFeature([UserAddress]),
  forwardRef(() => UserModule),
  ],
  controllers: [UserAddressController],
  providers: [UserAddressService],
  exports: [TypeOrmModule]
})
export class UserAddressModule { }
