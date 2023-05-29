import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Product } from 'src/product/entities/product.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class CategoryService {
  constructor(@InjectRepository(Category) private readonly cateRepository: Repository<Category>,
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) { }
  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const check = await this.cateRepository.findOne({ where: [{ 'name': createCategoryDto.name }] });
    const user = await this.userRepository.findOne({ where: [{ 'id': createCategoryDto.userid }] })
    if (check) {
      throw new ConflictException('có rồi')
    }
    delete createCategoryDto.userid
    createCategoryDto.status = "out of stock";
    const newCategory = this.cateRepository.create({
      ...createCategoryDto,
      user: user
    })
    return await this.cateRepository.save(newCategory)
  }

  async findAll(): Promise<Category[]> {
    return await this.cateRepository.find({
      relations: ['product']
    });
  }

  async findByUser(userid: number): Promise<Category[]> {
    const cateByUser = (await this.queryBuiler('category'))
      .innerJoinAndSelect('category.user', 'user', 'category.userid = user.id')
      .getMany();
    (await cateByUser).forEach((cate) => {
      if (cate.user.id == userid) {
        delete cate.user.password;
        delete cate.user.refresh_token;
      } else {
        delete cate.user;
      }
    })
    return cateByUser
  }

  async queryBuiler(alias: string) {
    return this.cateRepository.createQueryBuilder(alias)
  }

  async findOne(id: number): Promise<Category> {
    const check = await this.cateRepository.findOne({ where: [{ id: id }] });
    if (!check) {
      throw new ConflictException('không có thư mục nào tên này')
    }
    return check
  }

  async update(id: number, updatecateDto: UpdateCategoryDto): Promise<UpdateResult> {
    const check = await this.cateRepository.findOne({ where: [{ 'name': updatecateDto.name }] });
    const curCate = await this.cateRepository.findOne({ where: [{ 'id': id }] });
    const user = await this.userRepository.findOne({ where: [{ 'id': updatecateDto.userid }] });
    const checkProByCate = await (await this.queryBuiler('category'))
      .innerJoinAndSelect('category.product', 'product', 'category.id = product.categoryid')
      .where('category.id = :id', { id })
      .getMany();
    if (check) {
      if (curCate.name == updatecateDto.name) {
        if (checkProByCate.length > 0) {
          updatecateDto.status = "Available";
        } else {
          updatecateDto.status = "Out of stock";
        }
        delete updatecateDto.userid
        const newCategory = {
          ...updatecateDto,
          user: user
        };
        return await this.cateRepository.update(id, newCategory)
      }
      throw new ConflictException('đã có danh mục này rồi')
    }
    if (checkProByCate.length > 0) {
      updatecateDto.status = "Available";
    } else {
      updatecateDto.status = "Out of stock";
    }
    delete updatecateDto.userid
    const newCategory = {
      ...updatecateDto,
      user: user
    };
    return await this.cateRepository.update(id, newCategory)
  }

  async remove(id: number): Promise<DeleteResult> {
    const categoryCheck = await (await this.queryBuiler('category'))
      .innerJoinAndSelect('category.product', 'product', 'category.id=product.category.id').where('category.id = :id ', { id }).getOne();

    if (categoryCheck) {
      throw new BadRequestException('category hiện đang có sản phẩm')
    }
    const destroyed = await this.cateRepository.delete(id)
    return destroyed
  }
}
