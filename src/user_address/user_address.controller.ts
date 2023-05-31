import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards, Req } from '@nestjs/common';
import { UserAddressService } from './user_address.service';
import { CreateUserAddressDto } from './dto/create-user_address.dto';
import { UpdateUserAddressDto } from './dto/update-user_address.dto';
import { UserAddress } from './entities/user_address.entity';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@UseGuards(AuthGuard('jwt'))
@Controller('api/user-address')
export class UserAddressController {
  constructor(private readonly userAddressService: UserAddressService) { }

  @Post()
  async create(@Body() createAddressDto: CreateUserAddressDto, @Req() req: Request & { user: any }) {
    createAddressDto.userid = req.user.user.id
    const res = await this.userAddressService.create(createAddressDto);
    return {
      statuscode: 200,
      message: "thêm mới thành công",
      result: res
    }
  }

  @Get('/getByUser')
  async getByUser(@Req() req: Request & { user: any }): Promise<UserAddress[]> {
    const userid = req.user.user.id;
    const addressByUser = await this.userAddressService.findByUser(userid);
    return addressByUser;
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<UserAddress> {
    return this.userAddressService.findOne(+id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateDressant: UpdateUserAddressDto, @Req() req: Request & { user: any }) {
    updateDressant.userid = req.user.user.id;
    const update = await this.userAddressService.update(id, updateDressant)
    return {
      statuscode: 200,
      message: "cập nhật thành công",
      result: update
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const destroyed = await this.userAddressService.remove(+id);
    return {
      statuscode: 200,
      message: "xóa thành công",
      result: destroyed
    }
  }
}
