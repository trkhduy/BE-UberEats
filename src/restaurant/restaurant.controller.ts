import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseInterceptors, UploadedFile, Query, Req, UseGuards } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';
import { Response, Request } from 'express';
import * as path from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('api/restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) { }

  @Post()
  async create(
    @Body() createRestaurantDto: CreateRestaurantDto,
    @Req() req: Request & { user: any }) {
    createRestaurantDto.userid = req.user.user.id
    const res = await this.restaurantService.create(createRestaurantDto);
    return {
      statuscode: 200,
      message: "thêm mới thành công",
      result: res
    }
  }

  @Get()
  async findAll(@Query('name') keyword: string, @Req() req: Request,): Promise<Restaurant[]> {
    const builder = await this.restaurantService.queryBuiler('restaurant');
    const page: number = parseInt(req.query.page as any) || 1;
    const perPage = 2;
    builder.offset((page - 1) * perPage).limit(perPage);
    var restaurant = await builder.getMany()
    if (keyword) {
      restaurant = await this.restaurantService.searchRestaurant(keyword)
    }

    return restaurant;
  }
  @Get('/detail')
  async findOne(@Req() req: Request & { user: any }): Promise<Restaurant> {
    const builder = await this.restaurantService.queryBuiler('restaurant');
    if (req.user.user.id) {
      const userid = req.user.user.id;
      builder.innerJoinAndSelect('restaurant.user', 'user', 'restaurant.userid = user.id').where('userid = :userid', { userid })
    }
    const restaurant = await builder.getOne();
    if (restaurant) {
      delete restaurant.user.password
      delete restaurant.user.refresh_token
    }
    return restaurant
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateRestaurant: UpdateRestaurantDto, @Req() req: Request & { user: any }) {
    updateRestaurant.userid = req.user.user.id;

    const update = await this.restaurantService.update(id, updateRestaurant);
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
