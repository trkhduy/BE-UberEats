import { Injectable } from '@nestjs/common';
import { CreateOderDto } from './dto/create-oder.dto';
import { UpdateOderDto } from './dto/update-oder.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';
import { User } from 'src/user/entities/user.entity';
import { UserAddress } from 'src/user_address/entities/user_address.entity';
import { StatusOder } from 'src/status_oder/entities/status_oder.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private readonly orderRepository: Repository<Order>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Restaurant) private readonly restaurantRepository: Repository<Restaurant>,
    @InjectRepository(StatusOder) private readonly statusOrderRepository: Repository<StatusOder>,
    @InjectRepository(UserAddress) private readonly userAddressRepository: Repository<UserAddress>
  ) { }
  async create(createOrderDto: CreateOderDto) {
    const res = await this.userRepository.findOne({ where: [{ 'id': createOrderDto.restaurantid }] })
    const user = await this.userRepository.findOne({ where: [{ 'id': createOrderDto.userid }] })
    const user_address = await this.userAddressRepository.findOne({ where: [{ 'id': createOrderDto.userAddressid }] })
    const statusOder = await this.statusOrderRepository.findOne({ where: [{ 'id': createOrderDto.statusid }] })
    await delete createOrderDto.userid
    await delete createOrderDto.driverid
    await delete createOrderDto.restaurantid
    await delete createOrderDto.userAddressid
    await delete createOrderDto.statusid

    let dataCreate = {
      ...createOrderDto,
      restaurant: res,
      user: user,
      user_address: user_address,
      status: statusOder
    };
    const newOrder = await this.orderRepository.save(dataCreate)
    delete newOrder.user.password;
    delete newOrder.user.refresh_token;
    delete newOrder.restaurant.password;
    delete newOrder.restaurant.refresh_token;
    return newOrder
  }


  async update(id: number, updateOrderDto: UpdateOderDto): Promise<any> {

    const driver = await this.userRepository.findOne({ where: { id: updateOrderDto.driverid } });
    const statusOrder = await this.statusOrderRepository.findOne({ where: { id: updateOrderDto.statusid } });
    delete updateOrderDto.driverid;
    delete updateOrderDto.statusid;
    const dataUpdate = {
      ...updateOrderDto,
      driver: driver,
      status: statusOrder
    };
    const update = await this.orderRepository.update(id, dataUpdate);
    return update;
  }

  async remove(id: number) {
    return await this.orderRepository.delete(id);
  }
}
