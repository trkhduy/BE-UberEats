import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserAddressDto } from './dto/create-user_address.dto';
import { UpdateUserAddressDto } from './dto/update-user_address.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { UserAddress } from './entities/user_address.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class UserAddressService {
  constructor(@InjectRepository(UserAddress) private readonly addressRepository: Repository<UserAddress>,
    @InjectRepository(User) private readonly userrepository: Repository<User>
  ) { }
  async create(userid: number, createUserAddressDto: CreateUserAddressDto) {

    const res = await this.userrepository.findOne({ where: [{ 'id': userid }] })
    console.log(res)

    const newUser_address = await this.addressRepository.create({
      ...createUserAddressDto,
      user: res
    });
    const create = await this.addressRepository.save(newUser_address)
    return create;
  }
  async findAll(): Promise<UserAddress[]> {
    return await this.addressRepository.find();
  }

  async findOne(id: number): Promise<UserAddress> {

    const check = await this.addressRepository.findOne({ where: [{ id: id }] });
    if (!check) {
      throw new ConflictException('không có địa chỉ  này')
    }

    return check
  }

  async update(id: number, updateaddressDto: UpdateUserAddressDto): Promise<UpdateResult> {
    const check = await this.addressRepository.findOne({ where: [{ 'name_address': updateaddressDto.name_address }] })

    if (check) {
      throw new ConflictException('đã có địa chỉ  này rồi')
    }
    const update = await this.addressRepository.update(id, updateaddressDto)
    return update
  }

  async remove(id: number): Promise<DeleteResult> {
    const destroyed = await this.addressRepository.delete(id)
    return destroyed
  }
}
