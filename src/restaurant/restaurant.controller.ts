import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';
import { UpdateResult } from 'typeorm';

@Controller('api/restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) { }

  @Post(':userid')
  async create(@Param('userid') userid: number, @Body() createRestaurantDto: CreateRestaurantDto) {
    const res = await this.restaurantService.create(userid, createRestaurantDto);
    return {
      statuscode: 200,
      message: "thêm mới thành công",
      result: res
    }
  }

  @Get()
  async findAll(): Promise<Restaurant[]> {
    return await this.restaurantService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Restaurant> {
    return this.restaurantService.findOne(+id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateRestaurant: UpdateRestaurantDto) {
    const update = await this.restaurantService.update(id, updateRestaurant)
    return {
      statuscode: 200,
      message: "cập nhật thành công",
      result: update
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const destroyed = await this.restaurantService.remove(+id);
    return {
      statuscode: 200,
      message: "xóa thành công",
      result: destroyed
    }
  }
}
