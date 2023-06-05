import { ConflictException, Injectable } from '@nestjs/common';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Voucher } from './entities/voucher.entity';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { User } from 'src/user/entities/user.entity';
import { OrderUpdateGateway } from 'src/order-update/order-update.gateway';

@Injectable()
export class VoucherService {
  constructor(
    @InjectRepository(Voucher) private readonly voucherRepository: Repository<Voucher>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private orderWS: OrderUpdateGateway
  ) { }

  async queryBuilder(alias: string) {
    return this.voucherRepository.createQueryBuilder(alias)
  }
  async create(CreateVoucherDto: CreateVoucherDto) {
    const check = await this.voucherRepository.findOne({ where: [{ 'name': CreateVoucherDto.name }] })
    const checkCode = await this.voucherRepository.findOne({ where: [{ 'code': CreateVoucherDto.code }] })
    const user = await this.userRepository.findOne({ where: [{ 'id': CreateVoucherDto.userid }] })
    await delete CreateVoucherDto.userid
    if (check || checkCode) {
      throw new ConflictException('Voucher already exists')
    }

    let dataCreate = this.voucherRepository.create({
      ...CreateVoucherDto,
      user: user,
    })

    return await this.voucherRepository.save(dataCreate)
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
    const user = await this.userRepository.findOne({ where: [{ 'id': updateVoucherDto.userid }] })
    await delete updateVoucherDto.userid
    if (check) {
      if (curPro.name == updateVoucherDto.name) {
        let dataUpdate = {
          id: id,
          ...updateVoucherDto,
          user: user,
        };
        return await this.voucherRepository.update(id, dataUpdate)
      }
      throw new ConflictException('đã có voucher này rồi ')
    }
    let dataUpdate = {
      id: id,
      ...updateVoucherDto,
      user: user,
    };
    return await this.voucherRepository.update(id, dataUpdate)
  }

  async remove(id: number): Promise<DeleteResult> {
    const destroyed = await this.voucherRepository.delete(id)
    return destroyed
  }

  async queryBuiler(alias: string) {
    return this.voucherRepository.createQueryBuilder(alias)
  }

  async findVoucherByCode(code: string): Promise<Voucher> {
    const detailVou = ((await this.queryBuilder('voucher')).where('voucher.code LIKE :code', { code: `%${code}%` }));
    console.log(detailVou.getQuery());
    return await detailVou.getOne();
  }
}
