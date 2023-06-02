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
import { log } from 'console';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private readonly orderRepository: Repository<Order>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(StatusOder) private readonly statusOrderRepository: Repository<StatusOder>,
    @InjectRepository(UserAddress) private readonly userAddressRepository: Repository<UserAddress>
  ) { }
  async create(restaurantid: number, statusOderid: number, userAddressid: number, userid: number, driverid: number, createOrderDto: CreateOderDto) {
    const check = await this.orderRepository.findOne({ where: [{ 'note': createOrderDto.note }] })
    const res = await this.userRepository.findOne({ where: [{ 'id': createOrderDto.restaurantid }] })
    const user = await this.userRepository.findOne({ where: [{ 'id': createOrderDto.userid }] })
    const driver = await this.userRepository.findOne({ where: [{ 'id': createOrderDto.driverid }] })
    const user_address = await this.userAddressRepository.findOne({ where: [{ 'id': createOrderDto.userAddressid }] })
    const statusOder = await this.statusOrderRepository.findOne({ where: [{ 'id': createOrderDto.statusOderid }] })
    await delete createOrderDto.userid
    await delete createOrderDto.driverid
    await delete createOrderDto.restaurantid
    await delete createOrderDto.userAddressid
    await delete createOrderDto.statusOderid

    let dataCreate = {
      ...createOrderDto,
      restaurant: res,
      user: user,
      driver: driver,
      user_address: user_address,
      status: statusOder
    };
    return await this.orderRepository.save(dataCreate)

  }

  async findAll(): Promise<Order[]> {
    return await this.orderRepository.find({
      relations:['users', 'orders']
    });

  }

  async update(id: number, updateOrderDto: UpdateOderDto): Promise<any> {
    const check = await this.orderRepository.findOne({ where: [{ 'note': updateOrderDto.note }] })
    const res = await this.userRepository.findOne({ where: [{ 'id': updateOrderDto.restaurantid }] })
    const user = await this.userRepository.findOne({ where: [{ 'id': updateOrderDto.userid }] })
    const driver = await this.userRepository.findOne({ where: [{ 'id': updateOrderDto.driverid }] })
    const user_address = await this.userAddressRepository.findOne({ where: [{ 'id': updateOrderDto.userAddressid }] })
    const statusOder = await this.statusOrderRepository.findOne({ where: [{ 'id': updateOrderDto.statusOderid }] })
    await delete updateOrderDto.userid
    await delete updateOrderDto.driverid
    await delete updateOrderDto.restaurantid
    await delete updateOrderDto.userAddressid
    await delete updateOrderDto.statusOderid

    let dataUpdate = {
      id: id,
      ...updateOrderDto,
      restaurant: res,
      user: user,
      driver: driver,
      user_address: user_address,
      status: statusOder
    };
    console.log(dataUpdate);
    
    return await this.orderRepository.update(id, dataUpdate)

    //  this.proRepository.update(id, newPro);
  }

  remove(id: number) {
    return `This action removes a #${id} oder`;
  }
}
