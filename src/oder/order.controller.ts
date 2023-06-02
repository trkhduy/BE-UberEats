import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Req, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOderDto } from './dto/create-oder.dto';
import { UpdateOderDto } from './dto/update-oder.dto';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('api/order')
export class OrderController {
  constructor(private readonly oderService: OrderService) { }

  @Post()
  async create(
    @Req() req: Request & { user: any },
    @Body() createOderDto: CreateOderDto) {
    createOderDto.userid = req.user.user.id
    console.log(createOderDto);
    const res = await this.oderService.create(createOderDto);
    return {
      statuscode: 200,
      message: "thêm mới thành công",
      result: res
    }
  }


  @Put(':id')
  async update(@Param('id') id: number, @Body() updateOrderDto: UpdateOderDto) {
    console.log(updateOrderDto);
    
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
