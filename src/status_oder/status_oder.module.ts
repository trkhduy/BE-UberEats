import { Module, forwardRef } from '@nestjs/common';
import { StatusOderService } from './status_oder.service';
import { StatusOderController } from './status_oder.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/oder/entities/order.entity';
import { StatusOder } from './entities/status_oder.entity';
import { OrderModule } from 'src/oder/order.module';

@Module({
  imports: [TypeOrmModule.forFeature([StatusOder]),
  forwardRef(() => OrderModule),
  ],
  controllers: [StatusOderController],
  providers: [StatusOderService],
  exports: [TypeOrmModule]
})
export class StatusOderModule { }
