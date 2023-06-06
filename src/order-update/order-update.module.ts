import { Module, forwardRef } from '@nestjs/common';
import { OrderUpdateGateway } from './order-update.gateway';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';
import { OrderModule } from 'src/oder/order.module';
import { OrderUpdateService } from './order-update.service';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/constants';

@Module({
  imports: [
    JwtModule.register({
        global: true,
        secret: jwtConstants.secret
    })],
  providers: [OrderUpdateGateway, OrderUpdateService],
  exports: [OrderUpdateGateway]
})
export class OrderUpdateModule { }
