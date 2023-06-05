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
import { OrderUpdateGateway } from 'src/order-update/order-update.gateway';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private readonly orderRepository: Repository<Order>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(StatusOder) private readonly statusOrderRepository: Repository<StatusOder>,
    @InjectRepository(UserAddress) private readonly userAddressRepository: Repository<UserAddress>,
    private readonly orderGetway: OrderUpdateGateway,
    private readonly configService: ConfigService
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
    await this.findByRes(newOrder.restaurant.id)
    return newOrder
  }

  async findOrderNeedDriver(statusId: number, id?: number): Promise<Order[]> {
    const builder = (await this.queryBuiler('order'))
      .innerJoinAndSelect('order.restaurant', 'restaurant', 'order.restaurantid = restaurant.id')
      .innerJoinAndSelect('order.status', 'status_oder', 'order.statusid = status_oder.id')
      .leftJoinAndSelect('order.voucher', 'voucher', 'order.voucherid = voucher.id')
      .innerJoinAndSelect('order.user', 'user', 'order.userid = user.id')
      .innerJoinAndSelect('order.user_address', 'user_address', 'order.userAddressid = user_address.id')
      .leftJoinAndSelect('order.driver', 'driver', 'order.driverid = driver.id')
      .leftJoinAndSelect('order.order_detail', 'order_detail', 'order.id = order_detail.orderid')
      .leftJoinAndSelect('order_detail.product', 'product', 'order_detail.productId = product.id')
      .where('status_oder.id = :statusId', { statusId })
    id && builder.andWhere('driver.id=:id', { id })
    const addressByUser = await builder.getMany();
    addressByUser.map((item: any) => {
      return item.order_detail.map((item2: any) => item2.product.images && (item2.product.images = this.configService.get('SERVER_HOST') + '/upload/' + item2.product.images))
    })
    this.orderGetway.handleGetOrderToDriver(addressByUser, null)
    return addressByUser;
  }
  async findByRes(restaurantid: number): Promise<Order[]> {
    const builder = (await this.queryBuiler('order'))
      .innerJoinAndSelect('order.restaurant', 'restaurant', 'order.restaurantid = restaurant.id')
      .innerJoinAndSelect('order.status', 'status_oder', 'order.statusid = status_oder.id')
      .leftJoinAndSelect('order.voucher', 'voucher', 'order.voucherid = voucher.id')
      .innerJoinAndSelect('order.user', 'user', 'order.userid = user.id')
      .innerJoinAndSelect('order.user_address', 'user_address', 'order.userAddressid = user_address.id')
      .leftJoinAndSelect('order.driver', 'driver', 'order.driverid = driver.id')
      .leftJoinAndSelect('order.order_detail', 'order_detail', 'order.id = order_detail.orderid')
      .leftJoinAndSelect('order_detail.product', 'product', 'order_detail.productId = product.id')
      .where('restaurantid = :restaurantid', { restaurantid })
    const addressByUser = await builder.getMany();
    addressByUser.map((item: any) => {
      return item.order_detail.map((item2: any) => item2.product.images && (item2.product.images = this.configService.get('SERVER_HOST') + '/upload/' + item2.product.images))
    })
    this.orderGetway.handleGetOrderTo(addressByUser, restaurantid)
    return addressByUser;
  }
  async findByClient(userid: number): Promise<Order[]> {
    const builder = (await this.queryBuiler('order'))
      .innerJoinAndSelect('order.restaurant', 'restaurant', 'order.restaurantid = restaurant.id')
      .innerJoinAndSelect('order.status', 'status_oder', 'order.statusid = status_oder.id')
      .innerJoinAndSelect('order.user', 'user', 'order.userid = user.id')
      .innerJoinAndSelect('order.user_address', 'user_address', 'order.userAddressid = user_address.id')
      .leftJoinAndSelect('order.driver', 'driver', 'order.driverid = driver.id')
      .leftJoinAndSelect('order.order_detail', 'order_detail', 'order.id = order_detail.orderid')
      .leftJoinAndSelect('order_detail.product', 'product', 'order_detail.productId = product.id')
      .where('userid = :userid', { userid })
    const addressByUser = await builder.getMany();
    this.orderGetway.handleGetOrderTo(addressByUser, userid)
    return addressByUser;
  }
  async findByDriver(driverid: number): Promise<Order[]> {
    const builder = (await this.queryBuiler('order'))
      .innerJoinAndSelect('order.restaurant', 'restaurant', 'order.restaurantid = restaurant.id')
      .innerJoinAndSelect('order.status', 'status_oder', 'order.statusid = status_oder.id')
      .innerJoinAndSelect('order.user', 'user', 'order.userid = user.id')
      .innerJoinAndSelect('order.user_address', 'user_address', 'order.userAddressid = user_address.id')
      .leftJoinAndSelect('order.driver', 'driver', 'order.driverid = driver.id')
      .leftJoinAndSelect('order.order_detail', 'order_detail', 'order.id = order_detail.orderid')
      .leftJoinAndSelect('order_detail.product', 'product', 'order_detail.productId = product.id')
      .where('driverid = :driverid', { driverid })
    const addressByUser = await builder.getMany();
    this.orderGetway.handleGetOrderTo(addressByUser, driverid)
    return addressByUser;
  }

  async queryBuiler(alias: string) {
    return this.orderRepository.createQueryBuilder(alias)
  }

  async update(id: number, updateOrderDto: UpdateOderDto, userId?: number): Promise<any> {
    console.log('updateOrderDto', updateOrderDto);
    if (updateOrderDto.statusid == 4) {
      updateOrderDto.driverid = userId
    }
    console.log('updateOrderDto.driverid', updateOrderDto.driverid);

    const driver = updateOrderDto.driverid ? await this.userRepository.findOne({ where: { id: updateOrderDto.driverid } }) : null;
    console.log('driver', driver);

    const statusOrder = await this.statusOrderRepository.findOne({ where: { id: updateOrderDto.statusid } });
    let restaurantid = updateOrderDto.restaurantid
    let clientid = updateOrderDto.clientid
    delete updateOrderDto.driverid;
    delete updateOrderDto.statusid;
    delete updateOrderDto.clientid;
    delete updateOrderDto.restaurantid;
    delete updateOrderDto.userid;
    const dataUpdate = {
      ...updateOrderDto,
      driver: driver,
      status: statusOrder
    };
    // !updateOrderDto.driverid && delete dataUpdate.driver
    console.log('dataUpdate', dataUpdate);

    const update = await this.orderRepository.update(id, dataUpdate);
    await this.findByRes(restaurantid)
    // await this.findByClient(clientid)
    await this.findOrderNeedDriver(3)
    driver && await this.findByDriver(driver.id)
    return update;
  }

  async remove(id: number) {
    return await this.orderRepository.delete(id);
  }
}
