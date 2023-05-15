import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseFilePipe, ConflictException, BadRequestException, Put } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { Product } from './entities/product.entity';


@Controller('api/product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post(':restaurantid')
  @UseInterceptors(
    FileInterceptor('images', {
      storage: diskStorage({
        destination: "./upload/",
        filename: (req, file, cb) => {
          const filename: string = path.parse(file.originalname).name.replace(/\s/g, '')
          const extension: string = path.parse(file.originalname).ext
          return cb(null, `${filename}${extension}`)
        }
      }),
    })
  )
  async create(
    @Param('restaurantid') restaurantid: number,
    @UploadedFile(new ParseFilePipe({
      fileIsRequired: true,
    })
    )
    images: Express.Multer.File,
    @Body() createProductDto: CreateProductDto
  ) {
    if (!images.filename) {
      throw new BadRequestException('thiếu ảnh r kìa');
    }
    createProductDto.images = images.filename;
    const res = await this.productService.create(restaurantid, createProductDto);
    return {
      statuscode: 200,
      message: "thêm mới thành công",
      result: res
    }
  }
  @Get()
  async findAll(): Promise<Product[]> {
    return await this.productService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Product> {
    return await this.productService.findOne(+id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateProductDto: UpdateProductDto) {
    const update = await this.productService.update(id, updateProductDto)
    return {
      statuscode: 200,
      message: "cập nhật thành công",
      result: update
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const destroyed = await this.productService.remove(+id);
    return {
      statuscode: 200,
      message: "xóa thành công",
      result: destroyed
    }
  }
}
