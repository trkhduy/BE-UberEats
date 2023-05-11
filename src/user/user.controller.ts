import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from './entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }


  @Post()
  async create(@Body() createDto: CreateUserDto) {
    console.log(createDto);

    const user = await this.userService.create(createDto);
    return {
      statuscode: 200,
      message: "them moi tai khoan thanh cong",
      result: user
    }
  }

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
