import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { RestaurantModule } from './restaurant/restaurant.module';

import { VoucherModule } from './voucher/voucher.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
