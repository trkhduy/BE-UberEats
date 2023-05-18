import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseInterceptors, UploadedFile, ParseFilePipe, BadRequestException } from '@nestjs/common';
import { VoucherService } from './voucher.service';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { Voucher } from './entities/voucher.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';


@Controller('api/voucher')
export class VoucherController {
  constructor(private readonly voucherService: VoucherService) { }

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
  async create(@Param('restaurantid') restaurantid: number, @Body() createVoucherDto: CreateVoucherDto,
    @UploadedFile(new ParseFilePipe({
      fileIsRequired: true,
    })
    )
    images: Express.Multer.File,
  ) {
    if (!images.filename) {
      throw new BadRequestException('thiếu ảnh r kìa');
    }
    createVoucherDto.images = images.filename;
    const res = await this.voucherService.create(restaurantid, createVoucherDto);
    console.log(restaurantid)
    return {
      statuscode: 200,
      message: "thêm mới thành công",
      result: res
    }
  }

  @Get()
  async findAll(): Promise<Voucher[]> {
    return await this.voucherService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Voucher> {
    return await this.voucherService.findOne(+id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateVoucherDto: UpdateVoucherDto) {
    const update = await this.voucherService.update(id, updateVoucherDto)
    return {
      statuscode: 200,
      message: "cập nhật thành công",
      result: update
    }
  }

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
