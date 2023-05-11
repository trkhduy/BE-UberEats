import { ConflictException, Injectable } from '@nestjs/common';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Voucher } from './entities/voucher.entity';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';

@Injectable()
export class VoucherService {
  constructor(@InjectRepository(Voucher) private readonly voucherRepository: Repository<Voucher>,
    @InjectRepository(Restaurant) private readonly resRepository: Repository<Restaurant>
  ) { }

  async create(restaurantid: number, createVoucherDto: CreateVoucherDto) {
    const check = await this.voucherRepository.findOne({ where: [{ 'name': createVoucherDto.name }] })
    const res = await this.resRepository.findOne({ where: [{ 'id': restaurantid }] })
    if (check) {
      throw new ConflictException('đã có voucher này rồi')
    }
    const newVoucher = await this.voucherRepository.create({
      ...createVoucherDto,
      restaurant: res
    });
    const create = await this.voucherRepository.save(newVoucher)
    return create;
  }

  async findAll(): Promise<Voucher[]> {
    return await this.voucherRepository.find();
  }

  async findOne(id: number): Promise<Voucher> {
    const check = await this.voucherRepository.findOne({ where: [{ id: id }] });
    if (!check) {
      throw new ConflictException('không có voucher này')
    }

    return check
  }

  async update(id: number, updatevouhertDto: UpdateVoucherDto): Promise<UpdateResult> {
    const check = await this.voucherRepository.findOne({ where: [{ 'name': updatevouhertDto.name }] })

    if (check) {
      throw new ConflictException('đã có voucher này rồi 3!!!')
    }

    const update = await this.voucherRepository.update(id, updatevouhertDto)
    return update
  }

  async remove(id: number): Promise<DeleteResult> {
    const destroyed = await this.voucherRepository.delete(id)
    return destroyed
  }
}
