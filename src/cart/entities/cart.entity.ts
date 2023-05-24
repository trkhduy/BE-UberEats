import { Product } from "src/product/entities/product.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('cart')
export class Cart {
    @PrimaryGeneratedColumn()
    id: number
    @Column()
    quantity: number
    @OneToMany(() => Product, product => product.cart)
    product: Product[]
    @OneToMany(() => User, user => user.cart)
    user: User
}
