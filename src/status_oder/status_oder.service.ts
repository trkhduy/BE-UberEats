import { Injectable } from '@nestjs/common';
import { CreateStatusOderDto } from './dto/create-status_oder.dto';
import { UpdateStatusOderDto } from './dto/update-status_oder.dto';
import { StatusOder } from './entities/status_oder.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { async } from 'rxjs';
import { Order } from 'src/oder/entities/order.entity';

@Injectable()
export class StatusOderService {
  constructor(@InjectRepository(StatusOder)
  private readonly statusRepository: Repository<StatusOder>,

  ) { }
  async create(createStatusOderDto: CreateStatusOderDto) {
    return await this.statusRepository.save(createStatusOderDto);
  }

  findAll() {
    return `This action returns all statusOder`;
  }

  findOne(id: number) {
    return `This action returns a #${id} statusOder`;
  }

  update(id: number, updateStatusOderDto: UpdateStatusOderDto) {
    return `This action updates a #${id} statusOder`;
  }

  remove(id: number) {
    return `This action removes a #${id} statusOder`;
  }
}
