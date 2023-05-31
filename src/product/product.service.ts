import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Category } from 'src/category/entities/category.entity';
import { User } from 'src/user/entities/user.entity';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Product) private readonly proRepository: Repository<Product>,
    @InjectRepository(Category) private readonly cateRepository: Repository<Category>,
  ) { }
  async create(createProductDto: CreateProductDto) {
    const check = await this.proRepository.findOne({ where: [{ 'name': createProductDto.name }] })
    const user = await this.userRepository.findOne({ where: [{ 'id': createProductDto.userid }] })
    const cate = await this.cateRepository.findOne({ where: [{ 'id': createProductDto.categoryid }] })
    if (check) {
      throw new ConflictException('đã có món ăn này rồi này rồi')
    }
    await delete createProductDto.categoryid
    await delete createProductDto.userid


    let dataCreate = {
      ...createProductDto,
      user: user,
      category: cate
    };

    return await this.proRepository.save(dataCreate)


  }
  async findAll(): Promise<Product[]> {
    return await this.proRepository.find({
      relations: ['user', 'category'],
    });

  }

  async findOne(id: number): Promise<Product> {
    const builder = (await this.queryBuiler('product'))
      .innerJoinAndMapOne('product.user', 'user', 'user', 'product.userid=user.id')
      .innerJoinAndMapOne('product.category', 'category', 'category', 'product.categoryid=category.id')
      .leftJoinAndMapOne('product.restaurant', 'restaurant', 'restaurant', 'user.id=restaurant.userid')
      .where('product.id = :id', { id })

    const detailPro: any = await builder.getOne();
    if (!detailPro) {
      throw new NotFoundException('không có món ăn nào tên này')
    }
    if (!detailPro.restaurant) {
      delete detailPro.restaurant
    }
    delete detailPro.user.password;
    delete detailPro.user.refresh_token;
    return detailPro
  }

  async relatedProduct(id: number): Promise<Product[]> {
    const thisProduct = await this.findOne(id);
    console.log(thisProduct);

    const categoryid = thisProduct.category.id;
    const limit = 8;
    const builder = (await this.queryBuiler('product'))
      .innerJoinAndMapOne('product.user', 'user', 'user', 'product.userid=user.id')
      .innerJoinAndMapOne('product.category', 'category', 'category', 'product.categoryid=category.id')
      .leftJoinAndMapOne('product.restaurant', 'restaurant', 'restaurant', 'user.id=restaurant.userid')
      .where('product.categoryid = :categoryid', { categoryid })
      .orderBy('product.created_at', 'DESC').take(limit);

    const relatedProduct = await builder.getMany();
    const newRelate = relatedProduct.filter((item) => {
      return item.id != thisProduct.id
    })
    return newRelate;
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
    const user = await this.userRepository.findOne({ where: [{ 'id': updateProDto.userid }] })
    const cate = await this.cateRepository.findOne({ where: [{ 'id': updateProDto.categoryid }] })
    await delete updateProDto.categoryid
    await delete updateProDto.userid
    if (check) {
      if (curPro.name == updateProDto.name) {
        let dataUpdate = {
          id: id,
          ...updateProDto,
          user: user,
          category: cate
        };
        return await this.proRepository.update(id, dataUpdate)
      }
      throw new ConflictException('đã có món ăn này rồi rồi')
    }
    let dataUpdate = {
      id: id,
      ...updateProDto,
      user: user,
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

  async getNewProduct(): Promise<Product[]> {
    const limit = 8;
    const builder = (await this.queryBuiler('product'))
      .innerJoinAndMapOne('product.user', 'user', 'user', 'product.userid=user.id')
      .leftJoinAndMapOne('product.restaurant', 'restaurant', 'restaurant', 'user.id=restaurant.userid')
      .orderBy('product.created_at', 'DESC').take(limit);
    const newProduct = await builder.getMany();
    return newProduct
  }

  async getSaleProduct(): Promise<Product[]> {
    const limit = 8;
    const builder = (await this.queryBuiler('product'))
      .innerJoinAndMapOne('product.user', 'user', 'user', 'product.userid=user.id')
      .leftJoinAndMapOne('product.restaurant', 'restaurant', 'restaurant', 'user.id=restaurant.userid')
      .where('product.sale_price > 0')
      .orderBy('product.created_at', 'DESC').take(limit);
    const saleProduct = await builder.getMany();
    return saleProduct
  }
}
