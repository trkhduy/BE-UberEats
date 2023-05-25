import { Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { DeleteResult, Repository } from 'typeorm';
import { Product } from 'src/product/entities/product.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class CartService {
  constructor(@InjectRepository(Cart) private readonly cartrepository: Repository<Cart>,
    @InjectRepository(Product) private readonly proRepository: Repository<Product>,
    @InjectRepository(User) private readonly userrepository: Repository<User>

  ) { }
  async create(createCartDto: CreateCartDto) {
    const check = await this.cartrepository.findOne({ where: [{ 'quantity': createCartDto.quantity }] })
    const product = await this.proRepository.findOne({ where: [{ 'id': createCartDto.productId }] })
    const user = await this.userrepository.findOne({ where: [{ 'id': createCartDto.userId }] })
    await delete createCartDto.productId
    await delete createCartDto.userId
    let dataCreate = {
      ...createCartDto,
      product: product,
      user: user
    };
    console.log(dataCreate);
    return await this.cartrepository.save(dataCreate)
  }



  async update(id: number, updateCartDto: UpdateCartDto) {

    let dataCreate = {
      id: id,
      ...updateCartDto,
    };
    console.log(dataCreate);
    return await this.cartrepository.update(id, dataCreate)
  }

  async remove(id: number): Promise<DeleteResult> {
    const destroyed = await this.cartrepository.delete(id)
    return destroyed
  }
}
