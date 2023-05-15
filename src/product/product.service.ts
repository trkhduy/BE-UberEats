import { ConflictException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Restaurant) private readonly resRepository: Repository<Restaurant>,
    @InjectRepository(Product) private readonly proRepository: Repository<Product>
  ) { }
  async create(restaurantid: number, createProductDto: CreateProductDto) {
    const check = await this.proRepository.findOne({ where: [{ 'name': createProductDto.name }] })
    const res = await this.resRepository.findOne({ where: [{ 'id': restaurantid }] })
    if (check) {
      throw new ConflictException('đã có món ăn này rồi này rồi')
    }
    console.log(res)
    const newPro = await this.proRepository.create({
      ...createProductDto,
      restaurant: res
    });

    const create = await this.proRepository.save(newPro)
    console.log(create)
    return create;
  }


  async findAll(): Promise<Product[]> {
    return await this.proRepository.find({
      relations: ['restaurant']
    });
  }

  async findOne(id: number): Promise<Product> {
    const check = await this.proRepository.findOne({ where: [{ id: id }] });
    if (!check) {
      throw new ConflictException('không có món ăn nào tên này')
    }

    return check
  }

  async update(id: number, updateProDto: UpdateProductDto): Promise<UpdateResult> {
    const check = await this.proRepository.findOne({ where: [{ 'name': updateProDto.name }] })
    const curPro = await this.proRepository.findOne({ where: [{ 'id': id }] })
    if (check) {
      if (curPro.name == updateProDto.name) {
        const update = await this.proRepository.update(id, updateProDto)
        return update
      }
      throw new ConflictException('đã có món ăn này rồi rồi')
    }
    const update = await this.proRepository.update(id, updateProDto)
    return update
  }
  async remove(id: number): Promise<DeleteResult> {
    const destroyed = await this.proRepository.delete(id)
    return destroyed
  }
}
