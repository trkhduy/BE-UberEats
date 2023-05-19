import { Injectable } from '@nestjs/common';
import { CreateOderDto } from './dto/create-oder.dto';
import { UpdateOderDto } from './dto/update-oder.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { StatusOder } from 'src/status_oder/entities/status_oder.entity';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private readonly orderRepository: Repository<Order>,
    @InjectRepository(Restaurant) private readonly resRepository: Repository<Restaurant>,
    @InjectRepository(StatusOder) private readonly statusRepository: Repository<StatusOder>
  ) { }
  create(createOderDto: CreateOderDto) {
    return 'This action adds a new oder';
  }

  findAll() {
    return `This action returns all oder`;
  }

  findOne(id: number) {
    return `This action returns a #${id} oder`;
  }

  update(id: number, updateOderDto: UpdateOderDto) {
    return `This action updates a #${id} oder`;
  }

  remove(id: number) {
    return `This action removes a #${id} oder`;
  }
}
