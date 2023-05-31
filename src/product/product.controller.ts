import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseFilePipe, ConflictException, BadRequestException, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { Product } from './entities/product.entity';
import { ConfigService } from '@nestjs/config'
import { Response, Request } from 'express';

import { AuthGuard } from '@nestjs/passport';
import { async } from 'rxjs';


@Controller('api/product')
export class ProductController {
  constructor(private readonly productService: ProductService,
    private readonly configService: ConfigService
  ) { }

  @UseGuards(AuthGuard('jwt'))
  @Post()
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
    @UploadedFile(new ParseFilePipe({
      fileIsRequired: true,
    }))
    images: Express.Multer.File,
    @Body() createProductDto: CreateProductDto,
    @Req() req: Request & { user: any }) {
    if (!images.filename) {
      throw new BadRequestException('thiếu ảnh r kìa');
    }

    createProductDto.userid = req.user.user.id
    createProductDto.images = images.filename;
    const res = await this.productService.create(createProductDto);
    delete res.user.password;
    delete res.user.refresh_token;
    return {
      statuscode: 200,
      message: "thêm mới thành công",
      result: res
    }
  }

  @Get()
  async findAll(@Query('name') keyword: string, @Query('userid') userid: number, @Query('categoryid') categoryid: number, @Req() req: Request,): Promise<Product[]> {
    const builder = (await this.productService.queryBuiler('product'))
      .innerJoinAndMapOne('product.user', 'user', 'user', 'product.userid=user.id')
      .innerJoinAndMapOne('product.category', 'category', 'category', 'product.categoryid=category.id')
      .leftJoinAndMapOne('product.restaurant', 'restaurant', 'restaurant', 'user.id=restaurant.userid');
    if (userid && !categoryid) {
      builder.where('user.id = :userid', { userid });
      if (keyword) {
        builder.andWhere('product.name LIKE :keyword', { keyword: `%${keyword}%` });
      }
      if (req.query.minPrice && req.query.maxPrice) {
        const minPrice = req.query.minPrice;
        const maxPrice = req.query.maxPrice;

        builder.andWhere('product.price BETWEEN :minPrice AND :maxPrice', { minPrice, maxPrice });
      }
      const productByUser: any = await builder.getMany();
      if (productByUser.length > 0) {
        productByUser.forEach((item: any) => {
          if (!item.restaurant) {
            delete item.restaurant;
          }
          delete item.user.password;
          delete item.user.refresh_token;
          item.user.avatar = this.configService.get('SERVER_HOST') + '/upload/' + item.user.avatar;
          item.images = this.configService.get('SERVER_HOST') + '/upload/' + item.images;
        })
      }
      return productByUser
    }
    if (categoryid && !userid) {
      builder.where('category.id = :categoryid', { categoryid });
      if (keyword) {
        builder.andWhere('product.name LIKE :keyword', { keyword: `%${keyword}%` });
      }
      if (req.query.minPrice && req.query.maxPrice) {
        const minPrice = req.query.minPrice;
        const maxPrice = req.query.maxPrice;

        builder.andWhere('product.price BETWEEN :minPrice AND :maxPrice', { minPrice, maxPrice });
      }
      const productByCate: any = await builder.getMany()
      if (productByCate.length > 0) {
        productByCate.forEach((item: any) => {
          if (!item.restaurant) {
            delete item.restaurant;
          }
          delete item.user.password;
          delete item.user.refresh_token;
          item.user.avatar = this.configService.get('SERVER_HOST') + '/upload/' + item.user.avatar;
          item.images = this.configService.get('SERVER_HOST') + '/upload/' + item.images
        })
      }
      return productByCate
    }
    if (categoryid && userid) {
      builder
        .where('user.id = :userid', { userid })
        .andWhere('category.id = :categoryid', { categoryid });
      if (keyword) {
        builder.andWhere('product.name LIKE :keyword', { keyword: `%${keyword}%` });
      }
      if (req.query.minPrice && req.query.maxPrice) {
        const minPrice = req.query.minPrice;
        const maxPrice = req.query.maxPrice;

        builder.andWhere('product.price BETWEEN :minPrice AND :maxPrice', { minPrice, maxPrice });
      }
      const productByAll: any = await builder.getMany()
      if (productByAll.length > 0) {
        productByAll.forEach((item: any) => {
          if (!item.restaurant) {
            delete item.restaurant;
          }
          delete item.user.password;
          delete item.user.refresh_token;
          item.user.avatar = this.configService.get('SERVER_HOST') + '/upload/' + item.user.avatar;
          item.images = this.configService.get('SERVER_HOST') + '/upload/' + item.images
        })
      }
      return productByAll
    }
    if (!categoryid && !userid) {
      if (keyword) {
        builder.andWhere('product.name LIKE :keyword', { keyword: `%${keyword}%` });
      }
      if (req.query.minPrice && req.query.maxPrice) {
        const minPrice = req.query.minPrice;
        const maxPrice = req.query.maxPrice;

        builder.andWhere('product.price BETWEEN :minPrice AND :maxPrice', { minPrice, maxPrice });
      }
    }

    const products: any = await builder.getMany();
    if (products.length > 0) {
      products.forEach((item: any) => {
        if (!item.restaurant) {
          delete item.restaurant;
        }
        delete item.user.password;
        delete item.user.refresh_token;
        item.user.avatar = this.configService.get('SERVER_HOST') + '/upload/' + item.user.avatar;
        item.images = this.configService.get('SERVER_HOST') + '/upload/' + item.images
      })
    }

    return products;

  }

  @Get('/getNewProduct')
  async getNewPro() {
    const newProduct = await this.productService.getNewProduct();
    newProduct.forEach((item) => {
      delete item.user.password;
      delete item.user.refresh_token;
      item.images = this.configService.get('SERVER_HOST') + '/upload/' + item.images;
      item.user.avatar = this.configService.get('SERVER_HOST') + '/upload/' + item.user.avatar;
    })
    return newProduct;
  }

  @Get('/getSaleProduct')
  async getSaleProduct() {
    const saleProduct = await this.productService.getSaleProduct();
    saleProduct.forEach((item) => {
      delete item.user.password;
      delete item.user.refresh_token;
      item.images = this.configService.get('SERVER_HOST') + '/upload/' + item.images;
      item.user.avatar = this.configService.get('SERVER_HOST') + '/upload/' + item.user.avatar;
    })
    return saleProduct;
  }
  //getProductByUser
  @UseGuards(AuthGuard('jwt'))
  @Get('/menu')
  async findMenu(@Req() req: Request & { user: any },): Promise<Product[]> {
    const userid = req.user.user.id;
    const builder = (await this.productService.queryBuiler('product'))
    builder.innerJoinAndSelect('product.user', 'user', 'product.userid=user.id').where('user.id = :userid', { userid });

    const products = await builder.getMany();
    if (products.length > 0) {
      products.forEach((item) => {
        delete item.user.password;
        delete item.user.refresh_token;
        item.images = this.configService.get('SERVER_HOST') + '/upload/' + item.images
      })
    }

    return products;
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Product> {
    const detailPro = await this.productService.findOne(+id);
    detailPro.user.avatar = this.configService.get('SERVER_HOST') + '/upload/' + detailPro.user.avatar
    detailPro.images = this.configService.get('SERVER_HOST') + '/upload/' + detailPro.images
    return detailPro;
  }

  @Get(':id/relatedProduct')
  async getRelatedProduct(@Param('id') id: string): Promise<Product[]> {
    const relateProduct: any = await this.productService.relatedProduct(+id);
    if (relateProduct) {
      relateProduct.forEach((item: any) => {
        if (!item.restaurant) {
          delete item.restaurant;
        }
        delete item.user.password;
        delete item.user.refresh_token;
        item.user.avatar = this.configService.get('SERVER_HOST') + '/upload/' + item.user.avatar;
        item.images = this.configService.get('SERVER_HOST') + '/upload/' + item.images;
      })
    }
    return relateProduct
  }


  // @Get('fill/:categoryid')
  // async fill(@Param('categoryid') categoryid: number,) {
  //   return await this.productService.fillter(categoryid);
  // }


  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
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
  async update(
    @UploadedFile(new ParseFilePipe({
      fileIsRequired: false,
    }))
    images: Express.Multer.File,
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
    @Req() req: Request & { user: any }) {
    if (!images) {
      delete updateProductDto.images
    } else {
      updateProductDto.images = images.filename
    }
    updateProductDto.userid = req.user.user.id
    console.log(updateProductDto);
    const update = await this.productService.update(id, updateProductDto)
    return {
      statuscode: 200,
      message: "cập nhật thành công",
      result: update
    }
  }

  @UseGuards(AuthGuard('jwt'))
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
