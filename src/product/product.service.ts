import { ConflictException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';
import { Category } from 'src/category/entities/category.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Restaurant) private readonly resRepository: Repository<Restaurant>,
    @InjectRepository(Product) private readonly proRepository: Repository<Product>,
    @InjectRepository(Category) private readonly cateRepository: Repository<Category>
  ) { }
  async create(createProductDto: CreateProductDto) {
    const check = await this.proRepository.findOne({ where: [{ 'name': createProductDto.name }] })
    const restaurant = await this.resRepository.findOne({ where: [{ 'id': createProductDto.restaurantid }] })
    const cate = await this.cateRepository.findOne({ where: [{ 'id': createProductDto.categoryid }] })
    if (check) {
      throw new ConflictException('đã có món ăn này rồi này rồi')
    }
    await delete createProductDto.categoryid
    await delete createProductDto.restaurantid


    let dataCreate = {
      ...createProductDto,
      restaurant: restaurant,
      category: cate
    };

    return await this.proRepository.save(dataCreate)


  }
  async findAll(): Promise<Product[]> {
    return await this.proRepository.find({
      relations: ['restaurant', 'category'],
    });

  }
  async findOne(id: number): Promise<Product> {
    const check = await this.proRepository.findOne({ where: [{ id: id }], relations: ['restaurant', 'category'] });
    if (!check) {
      throw new ConflictException('không có món ăn nào tên này')
    }
    return check
  }
  async fillter(categoryid: number) {

    const productByCategory = await this.proRepository.createQueryBuilder('product')
      .innerJoinAndSelect('product.category', 'category')
      .where('category.id = :categoryid', { categoryid }).getMany()
    return productByCategory

  }

  async queryBuiler(alias: string) {
    return this.proRepository.createQueryBuilder(alias)
  }
  async update(id: number, updateProDto: UpdateProductDto): Promise<any> {
    const check = await this.proRepository.findOne({ where: [{ 'name': updateProDto.name }] })
    const curPro = await this.proRepository.findOne({ where: [{ 'id': id }] })
    const restaurant = await this.resRepository.findOne({ where: [{ 'id': updateProDto.restaurantid }] })
    const cate = await this.cateRepository.findOne({ where: [{ 'id': updateProDto.categoryid }] })
    await delete updateProDto.categoryid
    await delete updateProDto.restaurantid
    if (check) {
      if (curPro.name == updateProDto.name) {
        let dataUpdate = {
          id: id,
          ...updateProDto,
          restaurant: restaurant,
          category: cate
        };
        return await this.proRepository.update(id, dataUpdate)
      }
      throw new ConflictException('đã có món ăn này rồi rồi')
    }
    let dataUpdate = {
      id: id,
      ...updateProDto,
      restaurant: restaurant,
      category: cate
    };
    return await this.proRepository.update(id, dataUpdate)
    //  this.proRepository.update(id, newPro);
  }
  async remove(id: number): Promise<DeleteResult> {
    const destroyed = await this.proRepository.delete(id)
    return destroyed
  }

  async searchProducts(keyword: string): Promise<Product[]> {
    const queryBuilder = this.proRepository.createQueryBuilder('product');

    queryBuilder.where('product.name LIKE :keyword OR product.description LIKE :keyword', { keyword: `%${keyword}%` });

    return queryBuilder.getMany();
  }

}
