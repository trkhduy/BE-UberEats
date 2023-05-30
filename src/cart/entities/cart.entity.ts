import { Product } from "src/product/entities/product.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('cart')
export class Cart {
    @PrimaryGeneratedColumn()
    id: number
    @Column({ type: 'integer' })
    quantity: number

    @ManyToOne(() => Product, product => product.cart)
    product: Product
    @ManyToOne(() => User, user => user.cart)
    @JoinColumn()
    user: User
}
