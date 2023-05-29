import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards, Req } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';


@Controller('api/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() createCatetDto: CreateCategoryDto, @Req() req: Request & { user: any }) {
    createCatetDto.userid = req.user.user.id;
    const res = await this.categoryService.create(createCatetDto);
    delete res.user.password;
    delete res.user.refresh_token;
    return {
      statuscode: 200,
      message: "thêm mới thành công",
      result: res
    }
  }

  @Get('')
  async findAll(): Promise<Category[]> {
    return await this.categoryService.findAll();
  }

  //getCateByUser
  @UseGuards(AuthGuard('jwt'))
  @Get('/getCateByUser')
  async getCateByUser(@Req() req: Request & { user: any }): Promise<Category[]> {
    const userid = req.user.user.id
    return await this.categoryService.findByUser(userid);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string): Promise<Category> {
  //   return this.categoryService.findOne(+id);
  // }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async update(@Param('id') id: number, @Body() updateCategory: UpdateCategoryDto, @Req() req: Request & { user: any }) {
    updateCategory.userid = req.user.user.id;
    const update = await this.categoryService.update(id, updateCategory);
    return {
      statuscode: 200,
      message: "cập nhật thành công",
      result: update
    }
  }

  @UseGuards(AuthGuard('jwt'))
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
