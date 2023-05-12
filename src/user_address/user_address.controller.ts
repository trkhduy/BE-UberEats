import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { UserAddressService } from './user_address.service';
import { CreateUserAddressDto } from './dto/create-user_address.dto';
import { UpdateUserAddressDto } from './dto/update-user_address.dto';
import { UserAddress } from './entities/user_address.entity';

@Controller('api/user-address')
export class UserAddressController {
  constructor(private readonly userAddressService: UserAddressService) { }

  @Post(':userid')
  async create(@Param('userid') userid: number, @Body() createVoucherDto: CreateUserAddressDto) {
    const res = await this.userAddressService.create(userid, createVoucherDto);

    return {
      statuscode: 200,
      message: "thêm mới thành công",
      result: res
    }
  }

  @Get()
  async findAll(): Promise<UserAddress[]> {
    return await this.userAddressService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<UserAddress> {
    return this.userAddressService.findOne(+id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateDressant: UpdateUserAddressDto) {
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
