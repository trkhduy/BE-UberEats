import { ConflictException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Product } from 'src/product/entities/product.entity';

@Injectable()
export class CategoryService {
  constructor(@InjectRepository(Category) private readonly cateRepository: Repository<Category>,
  
  ) { }
  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const check = await this.cateRepository.findOne({ where: [{ 'name': createCategoryDto.name }] })
    if (check) {
      throw new ConflictException('có rồi')
    }
    return await this.cateRepository.save(createCategoryDto)
  }

  async findAll(): Promise<Category[]> {
    return await this.cateRepository.find({
      relations: ['product']

    });
  }
  async findOne(id: number): Promise<Category> {
    const check = await this.cateRepository.findOne({ where: [{ id: id }] });
    if (!check) {
      throw new ConflictException('không có thư mục nào tên này')
    }
    return check
  }
  async fillTer(id: number): Promise<any> { }

  async update(id: number, updatecateDto: UpdateCategoryDto): Promise<UpdateResult> {
    const check = await this.cateRepository.findOne({ where: [{ 'name': updatecateDto.name }] })

    if (check) {
      throw new ConflictException('đã có địa chỉ  này rồi')
    }
    const update = await this.cateRepository.update(id, updatecateDto)
    return update
  }

  async remove(id: number): Promise<DeleteResult> {
    const destroyed = await this.cateRepository.delete(id)
    return destroyed
  }
}
