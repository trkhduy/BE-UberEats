import { Module, forwardRef } from '@nestjs/common';
import { OrderUpdateGateway } from './order-update.gateway';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';
import { OrderModule } from 'src/oder/order.module';

@Module({
  imports: [
    forwardRef(() => OrderModule),
    // forwardRef(() => AuthModule),
    // AuthModule
  ],
  providers: [OrderUpdateGateway],
  exports: [OrderUpdateGateway]
})
export class OrderUpdateModule { }
