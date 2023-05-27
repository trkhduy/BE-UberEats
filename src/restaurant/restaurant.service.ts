import { ConflictException, Injectable } from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { User } from 'src/user/entities/user.entity';


@Injectable()
export class RestaurantService {
  constructor(@InjectRepository(Restaurant) private readonly resRepository: Repository<Restaurant>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) { }
  async create(createRestaurantDto: CreateRestaurantDto): Promise<Restaurant> {
    const user = await this.userRepository.findOne({ where: [{ 'id': createRestaurantDto.userid }] })
    await delete createRestaurantDto.userid
    const newRestaurant = this.resRepository.create({
      ...createRestaurantDto,
      user
    });
    return await this.resRepository.save(newRestaurant)
  }

  async findAll(): Promise<Restaurant[]> {
    return await this.resRepository.find({
      relations: ['voucher', 'product']
    });
  }
  async queryBuiler(alias: string) {
    return this.resRepository.createQueryBuilder(alias)
  }

  // async findOne(id: number): Promise<Restaurant> {

  //   const check = await this.resRepository.findOne({ where: [{ id: id }] });
  //   if (!check) {
  //     throw new ConflictException('không có nhà hàng này')
  //   }

  //   return check
  // }

  async update(id: number, updateResDto: UpdateRestaurantDto): Promise<any> {
    const check = await this.resRepository.findOne({ where: [{ 'address': updateResDto.address }] })
    const curRes = await this.resRepository.findOne({ where: [{ 'id': id }] })
    const user = await this.userRepository.findOne({ where: [{ 'id': updateResDto.userid }] })
    await delete updateResDto.userid
    if (check) {
      if (curRes.address == updateResDto.address) {
        let dataUpdate = {
          ...updateResDto,
          user: user
        };
        return await this.resRepository.update(id, dataUpdate)
      }
      throw new ConflictException('có nhà hàng này r')
    }
    let dataUpdate = await this.resRepository.create({
      ...updateResDto,
      user: user
    })
    return await this.resRepository.update(id, dataUpdate)
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
