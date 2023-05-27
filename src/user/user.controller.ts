import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UseGuards, Req, Put, ParseFilePipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from './entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { get } from 'http';
import { diskStorage } from 'multer';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';

@Controller('api/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private configService: ConfigService
  ) { }


  @Post('/register')
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

  @UseGuards(AuthGuard('jwt'))
  @Get('/profile')
  async findOne(@Req() req: Request & { user: any }) {
    const builder = await this.userService.queryBuiler('user');
    builder.innerJoinAndSelect('user.restaurant', 'restaurant', 'user.id = restaurant.userid')

    const user = await builder.getOne();
    if (user) {
      user.avatar = this.configService.get('SERVER_HOST') + '/upload/' + user.avatar;
      delete user.password;
      delete user.refresh_token;
    }
    return user
  }

  @UseGuards(AuthGuard('jwt'))
  @Put()
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: "./upload/",
        filename: (req, file, cb) => {
          const filename: string = path.parse(file.originalname).name.replace(/\s/g, '')
          const extension: string = path.parse(file.originalname).ext
          return cb(null, `${filename}${extension}`)
        }
      }),
    })
  )
  async update(@Body() updateUserDto: UpdateUserDto,
    @Req() req: Request & { user: any },
    @UploadedFile(new ParseFilePipe({
      fileIsRequired: false
    }))
    image: Express.Multer.File) {
    console.log(updateUserDto);

    if (!image) {
      delete updateUserDto.avatar
    } else {
      updateUserDto.avatar = image.filename
    }

    // const update = await this.userService.updateInfo(req.user.user.id, updateUserDto);
    return {
      statuscode: 200,
      message: "Update thông tin thành công",
      // result: update
    }

  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userService.remove(+id);
  // }


}
