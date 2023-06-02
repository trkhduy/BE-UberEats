import { Module } from '@nestjs/common';
import { OrderUpdateGateway } from './order-update.gateway';

@Module({
  providers: [OrderUpdateGateway],
  exports: [OrderUpdateGateway]
})
export class OrderUpdateModule { }
