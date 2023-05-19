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
    console.log(create)

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

  async update(id: number, updateVoucherDto: UpdateVoucherDto): Promise<any> {
    const check = await this.voucherRepository.findOne({ where: [{ 'name': updateVoucherDto.name }] })
    const curPro = await this.voucherRepository.findOne({ where: [{ 'id': id }] })
    const restaurant = await this.resRepository.findOne({ where: [{ 'id': updateVoucherDto.restaurantid }] })


    await delete updateVoucherDto.restaurantid
    if (check) {
      if (curPro.name == updateVoucherDto.name) {
        let dataUpdate = {
          id: id,
          ...updateVoucherDto,
          restaurant: restaurant,

        };
        return await this.voucherRepository.update(id, dataUpdate)
      }
      throw new ConflictException('đã có món ăn này rồi rồi')
    }
    let dataUpdate = {
      id: id,
      ...updateVoucherDto,
      restaurant: restaurant,
    };
    return await this.voucherRepository.update(id, dataUpdate)
    //  this.proRepository.update(id, newPro);
  }
  async remove(id: number): Promise<DeleteResult> {
    const destroyed = await this.voucherRepository.delete(id)
    return destroyed
  }
  async searchProducts(keyword: string): Promise<Voucher[]> {
    const queryBuilder = this.voucherRepository.createQueryBuilder('voucher');

    queryBuilder.where('voucher.name LIKE :keyword ', { keyword: `%${keyword}%` });

    return queryBuilder.getMany();
  }
  async queryBuiler(alias: string) {
    return this.voucherRepository.createQueryBuilder(alias)
  }
}
