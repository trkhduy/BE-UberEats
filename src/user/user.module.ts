import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { MulterModule } from '@nestjs/platform-express';
import { OrderModule } from 'src/oder/order.module';

@Module({
  imports: [TypeOrmModule.forFeature([User],),
  MulterModule.register({ dest: './upload' }),
  forwardRef(() => OrderModule)
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [TypeOrmModule]
})
export class UserModule { }
