import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOderDto } from './dto/create-oder.dto';
import { UpdateOderDto } from './dto/update-oder.dto';

@Controller('oder')
export class OrderController {
  constructor(private readonly oderService: OrderService) {}

  @Post()
  create(@Body() createOderDto: CreateOderDto) {
    return this.oderService.create(createOderDto);
  }

  @Get()
  findAll() {
    return this.oderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.oderService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOderDto: UpdateOderDto) {
    return this.oderService.update(+id, updateOderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.oderService.remove(+id);
  }
}
