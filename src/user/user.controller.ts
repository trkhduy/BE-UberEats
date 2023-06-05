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

  @Get('restaurant')
  async getUserByRes(): Promise<User[]> {
    return await this.userService.findByRes();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/profile')
  async findOne(@Req() req: Request & { user: any }) {
    const id = req.user.user.id;
    const builder = await this.userService.queryBuiler('user');
    const builderRes = (await this.userService.queryBuilerRes('restaurant'));
    const builderUserAd = await this.userService.queryBuilerUserAd('user_address');
    builder.where('user.id = :id', { id });

    const user = await builder.getOne();
    if (user) {
      user.avatar = this.configService.get('SERVER_HOST') + '/upload/' + user.avatar;
      delete user.password;
      delete user.refresh_token;
    }
    if (req.user.user.role === 3) {
      builderRes.where('restaurant.userid = :id', { id })
      const resByUser = await builderRes.getOne();
      delete user.password;
      delete user.refresh_token;
      return resByUser ? {
        ...user,
        restaurant: resByUser
      } : {
        ...user
      }
    }
    if (req.user.user.role === 1) {
      builderUserAd.where('user_address.userid = :id', { id })
      const userAdd = await builderUserAd.getMany();
      delete user.password;
      delete user.refresh_token;
      return {
        ...user,
        addresses: userAdd
      }
    }

    return { ...user }

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

    const update = await this.userService.updateInfo(req.user.user.id, updateUserDto);
    return {
      statuscode: 200,
      message: "Update thông tin thành công",
      result: update
    }

  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userService.remove(+id);
  // }


}
