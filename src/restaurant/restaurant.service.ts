import { ConflictException, Injectable } from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { User } from 'src/user/entities/user.entity';
import { Product } from 'src/product/entities/product.entity';

@Injectable()
export class RestaurantService {
  constructor(@InjectRepository(Restaurant) private readonly resRepository: Repository<Restaurant>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,

  ) { }
  async create(userId: number, createRestaurantDto: CreateRestaurantDto): Promise<Restaurant> {
    const check = await this.resRepository.findOne({ where: [{ 'name': createRestaurantDto.name }] })
    const user = await this.userRepository.findOne({ where: [{ 'id': userId }] })
    if (check) {
      throw new ConflictException('có rồi')
    }
    const newRestaurant = await this.resRepository.create({
      ...createRestaurantDto,
      user
    });
    const create = await this.resRepository.save(newRestaurant)
    return create;

  }

  async findAll(): Promise<Restaurant[]> {
    return await this.resRepository.find({
      relations: ['voucher']
    });
  }
  async queryBuiler(alias: string) {
    return this.resRepository.createQueryBuilder(alias)
  }
  async findOne(id: number): Promise<Restaurant> {

    const check = await this.resRepository.findOne({ where: [{ id: id }] });
    if (!check) {
      throw new ConflictException('không có nhà hàng này')
    }

    return check
  }

  async update(id: number, updateRestaurantDto: UpdateRestaurantDto): Promise<UpdateResult> {
    const check = await this.resRepository.findOne({ where: [{ 'name': updateRestaurantDto.name }] })
    const checkadd = await this.resRepository.findOne({ where: [{ 'address': updateRestaurantDto.address }] })
    const curRes = await this.resRepository.findOne({ where: [{ 'id': id }] })
    if (check) {
      if (curRes.name == updateRestaurantDto.name && curRes.address == updateRestaurantDto.address) {
        const update = await this.resRepository.update(id, updateRestaurantDto)
        return update
      }
      throw new ConflictException('đã có nhà hàng này rồi')
    }
    if (checkadd) {
      if (curRes.name == updateRestaurantDto.name && curRes.address == updateRestaurantDto.address) {
        const update = await this.resRepository.update(id, updateRestaurantDto)
        return update
      }
      throw new ConflictException('trùng địa chỉ với nhà hàng khác rồi')
    }
    const update = await this.resRepository.update(id, updateRestaurantDto)
    return update
  }

  async remove(id: number): Promise<DeleteResult> {
    const destroyed = await this.resRepository.delete(id)
    return destroyed
  }
  async searchRestaurant(keyword: string): Promise<Restaurant[]> {
    const queryBuilder = this.resRepository.createQueryBuilder('restaurant');

    queryBuilder.where('restaurant.name LIKE :keyword ', { keyword: `%${keyword}%` });

    return queryBuilder.getMany();


  }
}
