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

  async queryBuiler(alias: string) {
    return this.addressRepository.createQueryBuilder(alias)
  }

  async create(createAddressDto: CreateUserAddressDto) {
    const user = await this.userrepository.findOne({ where: [{ 'id': createAddressDto.userid }] })
    await delete createAddressDto.userid
    let dataCreate = {
      ...createAddressDto,
      user: user,
    };
    return await this.addressRepository.save(dataCreate)
  }

  async findByUser(userid: number): Promise<UserAddress[]> {
    const builder = (await this.queryBuiler('user_address'))
      .innerJoinAndSelect('user_address.user', 'user', 'user_address.userid = user.id')
      .where('userid = :userid', { userid })
    const addressByUser = await builder.getMany();
    addressByUser.forEach((e) => {
      delete e.user.password;
      delete e.user.refresh_token;
    })
    return addressByUser;
  }

  async findOne(id: number): Promise<UserAddress> {

    const check = await this.addressRepository.findOne({ where: [{ id: id }] });
    if (!check) {
      throw new ConflictException('không có địa chỉ  này')
    }

    return check
  }

  async update(id: number, updateAddressDto: UpdateUserAddressDto) {
    const user = await this.userrepository.findOne({ where: [{ 'id': updateAddressDto.userid }] })
    await delete updateAddressDto.userid
    let dataUpdate = {
      id: id,
      ...updateAddressDto,
      user: user,

    };
    return await this.addressRepository.update(id, dataUpdate)
  }

  async remove(id: number): Promise<DeleteResult> {
    const destroyed = await this.addressRepository.delete(id)
    return destroyed
  }
}
