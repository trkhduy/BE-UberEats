import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOderDto } from './dto/create-oder.dto';
import { UpdateOderDto } from './dto/update-oder.dto';

@Controller('api/order')
export class OrderController {
  constructor(private readonly oderService: OrderService) { }

  @Post()
  async create(@Param('restaurantid') restaurantid: number,
    @Param('statusOderid') statusOderid: number,
    @Param('userAddressid') userAddressid: number,
    @Param('userid') userid: number,
    @Param('driverid') driverid: number,
    @Body() createOderDto: CreateOderDto) {

    const res = await this.oderService.create(restaurantid, statusOderid, userAddressid, userid, driverid, createOderDto);
    return {
      statuscode: 200,
      message: "thêm mới thành công",
      result: res
    }
  }
  @Put(':id')
  async update(@Param('id') id: number, @Body() updateOrderDto: UpdateOderDto) {
    const update = await this.oderService.update(id, updateOrderDto)
    return {
      statuscode: 200,
      message: "cập nhật thành công",
      result: update
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.oderService.remove(+id);
  }
}
