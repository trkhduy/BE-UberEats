import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseFilePipe, ConflictException, BadRequestException, Put, Query, Req } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { Product } from './entities/product.entity';
import { Category } from 'src/category/entities/category.entity';
import { Response, Request } from 'express';
import { isRFC3339 } from 'class-validator';


@Controller('api/product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post(':restaurantid/:categoryid')
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
    @Param('restaurantid') restaurantid: number, @Param('categoryid') categoryid: number,
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
    const res = await this.productService.create(restaurantid, categoryid, createProductDto);
    return {
      statuscode: 200,
      message: "thêm mới thành công",
      result: res
    }
  }
  @Get()
  async findAll(@Query('name') keyword: string, @Query('restaurantid') restaurantid: number, @Query('categoryid') categoryid: number, @Req() req: Request,): Promise<Product[]> {
    const builder = (await this.productService.queryBuiler('product'))

    if (restaurantid && !categoryid) {
      builder.innerJoinAndSelect('product.restaurant', 'restaurant').andWhere('restaurant.id = :restaurantid', { restaurantid })
      if (keyword) {
        builder.andWhere('product.name LIKE :keyword', { keyword: `%${keyword}%` });
      }
      if (req.query.minPrice && req.query.maxPrice) {
        const minPrice = req.query.minPrice;
        const maxPrice = req.query.maxPrice;

        builder.andWhere('product.price BETWEEN :minPrice AND :maxPrice', { minPrice, maxPrice });
      }
    }
    if (categoryid && !restaurantid) {
      const productByCate = builder.innerJoinAndSelect('product.category', 'category').andWhere('category.id = :categoryid', { categoryid })
      if (keyword) {
        builder.andWhere('product.name LIKE :keyword', { keyword: `%${keyword}%` });
      }
      if (req.query.minPrice && req.query.maxPrice) {
        const minPrice = req.query.minPrice;
        const maxPrice = req.query.maxPrice;

        builder.andWhere('product.price BETWEEN :minPrice AND :maxPrice', { minPrice, maxPrice });
      }
      return productByCate.getMany()
    }
    if (categoryid && restaurantid) {
      const productByAll = builder
        .innerJoinAndSelect('product.restaurant', 'restaurant')
        .innerJoinAndSelect('product.category', 'category')
        .where('restaurant.id = :restaurantid', { restaurantid })
        .andWhere('category.id = :categoryid', { categoryid });
      if (keyword) {
        builder.andWhere('product.name LIKE :keyword', { keyword: `%${keyword}%` });
      }
      if (req.query.minPrice && req.query.maxPrice) {
        const minPrice = req.query.minPrice;
        const maxPrice = req.query.maxPrice;

        builder.andWhere('product.price BETWEEN :minPrice AND :maxPrice', { minPrice, maxPrice });
      }
      return productByAll.getMany()
    }
    if (!categoryid && !restaurantid) {
      if (keyword) {
        builder.andWhere('product.name LIKE :keyword', { keyword: `%${keyword}%` });
      }
      if (req.query.minPrice && req.query.maxPrice) {
        const minPrice = req.query.minPrice;
        const maxPrice = req.query.maxPrice;

        builder.andWhere('product.price BETWEEN :minPrice AND :maxPrice', { minPrice, maxPrice });
      }
    }


    return builder.getMany();

  }


  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Product> {
    return await this.productService.findOne(+id);
  }

  @Get('fill/:categoryid')
  async fill(@Param('categoryid') categoryid: number,) {
    return await this.productService.fillter(categoryid);
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
