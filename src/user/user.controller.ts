import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from './entities/user.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) { }


  @Post()
  async create(@Body() createDto: CreateUserDto) {
    const user = await this.userService.create(createDto);
    return {
      statuscode: 200,
      message: "thêm mới tài khoản thành công",
      result: user
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(): Promise<User[]> {
    return await this.userService.findAll();
  }



  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
