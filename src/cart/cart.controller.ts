import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Controller('api/cart')
export class CartController {
  constructor(private readonly cartService: CartService) { }

  @Post()
  create(@Body() createCartDto: CreateCartDto) {
    return this.cartService.create(createCartDto);
  }


  @Put(':id')
  async update(@Param('id') id: number, @Body() updateCartDto: UpdateCartDto) {
    const update = await this.cartService.update(id, updateCartDto);
    return {
      statuscode: 200,
      message: "cập nhật thành công",
      result: update
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const destroyed = await this.cartService.remove(+id);
    return {
      statuscode: 200,
      message: "xoa thành công",
      result: destroyed
    }
  }
}
