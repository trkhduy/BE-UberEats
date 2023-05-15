import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { VoucherService } from './voucher.service';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { Voucher } from './entities/voucher.entity';


@Controller('api/voucher')
export class VoucherController {
  constructor(private readonly voucherService: VoucherService) { }

  @Post(':restaurantid')
  async create(@Param('restaurantid') restaurantid: number, @Body() createVoucherDto: CreateVoucherDto) {
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
