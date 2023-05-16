import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Controller('api/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @Post()
  async create(@Body() createCatetDto: CreateCategoryDto) {
    const res = await this.categoryService.create(createCatetDto);
    return {
      statuscode: 200,
      message: "thêm mới thành công",
      result: res
    }
  }

  @Get()
  async findAll(): Promise<Category[]> {
    return await this.categoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Category> {
    return this.categoryService.findOne(+id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateCategory: UpdateCategoryDto) {
    const update = await this.categoryService.update(id, updateCategory)
    return {
      statuscode: 200,
      message: "cập nhật thành công",
      result: update
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const destroyed = await this.categoryService.remove(+id);
    return {
      statuscode: 200,
      message: "xóa thành công",
      result: destroyed
    }
  }
}
