import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseInterceptors, UploadedFile, ParseFilePipe, BadRequestException, Query, Req, UseGuards } from '@nestjs/common';
import { VoucherService } from './voucher.service';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { Voucher } from './entities/voucher.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response, Request } from 'express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';


@Controller('api/voucher')
export class VoucherController {
  constructor(private readonly voucherService: VoucherService,
    private configService: ConfigService
  ) { }

  @UseGuards(AuthGuard('jwt'))
  @Post('')
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
  async create(@Body() createVoucherDto: CreateVoucherDto,
    @UploadedFile(new ParseFilePipe({
      fileIsRequired: true,
    })
    )
    images: Express.Multer.File,
    @Req() req: Request & { user: any }
  ) {

    if (!images.filename) {
      throw new BadRequestException('thiếu ảnh r kìa');
    }
    createVoucherDto.userid = req.user.user.id
    createVoucherDto.images = images.filename;
    const voucher = await this.voucherService.create(createVoucherDto);
    delete voucher.user.password;
    delete voucher.user.refresh_token;
    return {
      statuscode: 200,
      message: "thêm mới thành công",
      result: voucher
    }
  }

  //get Voucher By Client
  @Get()
  async findAll(@Query('name') keyword: string, @Query('userid') userid: number, @Query('sortBy') sortBy: any, @Req() req: Request,): Promise<Voucher[]> {
    const builder = (await this.voucherService.queryBuiler('voucher'))
    builder.innerJoinAndMapOne('voucher.user', 'user', 'user', 'voucher.userid=user.id')
    if (userid) {
      builder.andWhere('user.id = :userid', { userid })
      if (keyword) {
        builder.andWhere('voucher.name LIKE :keyword', { keyword: `%${keyword}%` });
      }
      if (sortBy) {
        builder.orderBy('voucher.discount', sortBy);
      }
    }
    if (!userid) {
      if (keyword) {
        builder.andWhere('voucher.name LIKE :keyword', { keyword: `%${keyword}%` });
      }
      if (sortBy) {
        builder.orderBy('voucher.discount', sortBy);
      }
    }

    const vouchers = await builder.getMany();
    if (vouchers.length > 0) {
      vouchers.forEach((voucher) => {
        delete voucher.user.password;
        delete voucher.user.refresh_token;
        voucher.images = this.configService.get('SERVER_HOST') + '/upload/' + voucher.images
      })
    }

    return vouchers
  }

  // get Voucher By User
  @UseGuards(AuthGuard('jwt'))
  @Get('/getByUser')
  async getVoucherByUser(@Query('name') keyword: string, @Req() req: Request & { user: any }): Promise<Voucher[]> {
    const userid = req.user.user.id;
    const builder = (await this.voucherService.queryBuiler('voucher'))
    builder.innerJoinAndMapOne('voucher.user', 'user', 'user', 'voucher.userid=user.id')
    builder.andWhere('user.id = :userid', { userid });
    if (keyword) {
      builder.andWhere('product.name LIKE :keyword', { keyword: `%${keyword}%` });
    }
    const vouchers = await builder.getMany();
    if (vouchers.length > 0) {
      vouchers.forEach((voucher) => {
        delete voucher.user.password;
        delete voucher.user.refresh_token;
        voucher.images = this.configService.get('SERVER_HOST') + '/upload/' + voucher.images
      })
    }

    return vouchers
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('/detailVoucher/:code')
  async detailVoucher(@Param('code') code: string) {
    const detailVoucher = await this.voucherService.findVoucherByCode(code)
    return detailVoucher;
  }
  // @Get(':id')
  // async findOne(@Param('id') id: string): Promise<Voucher> {
  //   return await this.voucherService.findOne(+id);
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
  async update(@Param('id') id: number, @Body() updateVoucherDto: UpdateVoucherDto,
    @UploadedFile(new ParseFilePipe({
      fileIsRequired: false,
    })
    )
    images: Express.Multer.File,
    @Req() req: Request & { user: any }
  ) {
    console.log(updateVoucherDto);
    if (!images) {
      delete updateVoucherDto.images;
    } else {
      updateVoucherDto.images = images.filename
    }
    updateVoucherDto.userid = req.user.user.id
    const update = await this.voucherService.update(id, updateVoucherDto)
    return {
      statuscode: 200,
      message: "cập nhật thành công",
      result: update
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const destroyed = await this.voucherService.remove(+id);
    return {
      statuscode: 200,
      message: "xóa thành công",
      result: destroyed
    }
  }
}
