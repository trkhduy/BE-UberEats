import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository, UpdateResult } from 'typeorm';
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userrepository: Repository<User>
  ) { }
  async create(data: CreateUserDto): Promise<CreateUserDto> {
    const email = await this.userrepository.findOne({ where: [{ 'email': data.email }] })
    if (email) {
      throw new ConflictException('trùng email rồi bạn ơi')
    }
    const passwordHashed = bcrypt.hashSync(data.password, 10)
    console.log(passwordHashed);
    try {
      const user = await this.userrepository.save({
        ...data,
        password: passwordHashed
      });
      delete user.password
      return user
    } catch (error) {
      return error
    }
  }

  async findAll(): Promise<User[]> {
    return await this.userrepository.find();
  }

  async updateInfo(id: number, updateUserDto: UpdateUserDto): Promise<UpdateResult> {
    const email = await this.userrepository.findOne({ where: [{ 'email': updateUserDto.email }] })
    const curUser = await this.userrepository.findOne({ where: [{ 'id': id }] })
    if (email) {
      if (curUser) {
        const updateUser = await this.userrepository.update(id, updateUserDto)
        return updateUser
      }
      throw new ConflictException('email đã tồn tại')
    }
    const updateUser = await this.userrepository.update(id, updateUserDto)
    return updateUser
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
