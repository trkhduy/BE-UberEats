import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userrepository: Repository<User>
  ) { }
  async create(data: CreateUserDto): Promise<CreateUserDto> {
    const checkus = await this.userrepository.findOne({ where: [{ 'user_name': data.user_name }]})
    const email = await this.userrepository.findOne({ where: [{ 'email': data.email }]})
    if (checkus) {
      throw new ConflictException('trùng tên tài khoản r bạn ơi')
    }
    if (email) {
      throw new ConflictException('trùng email rồi bạn ơi')
    }
    const user = await this.userrepository.save(data);
    return user
  }

  async findAll(): Promise<User[]> {
    return await this.userrepository.find();
  }

  async findnName(user_name: string): Promise<User> {
    return await this.userrepository.findOne({ where: [{ 'user_name': user_name }] });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
