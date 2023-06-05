import { Cart } from "src/cart/entities/cart.entity";
import { Category } from "src/category/entities/category.entity";
import { Order } from "src/oder/entities/order.entity";
import { Product } from "src/product/entities/product.entity";
import { Restaurant } from "src/restaurant/entities/restaurant.entity";
import { UserAddress } from "src/user_address/entities/user_address.entity";
import { Voucher } from "src/voucher/entities/voucher.entity";
import { BeforeInsert, Column, Entity, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity('user')
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        length: 255,
        charset: 'utf8mb4',
        collation: 'utf8mb4_unicode_ci',
    })
    name: string;

    @Column({
        type: 'varchar',
        length: 255,
        charset: 'utf8mb4',
        collation: 'utf8mb4_unicode_ci',
        unique: true
    })
    email: string;

    @Column({
        type: 'varchar',
        length: 255,
        charset: 'utf8mb4',
        collation: 'utf8mb4_unicode_ci',
        default: 'default-avatar.png'
    })
    avatar: string;

    @Column({
        type: 'varchar',
        length: 255,
        charset: 'utf8mb4',
        collation: 'utf8mb4_unicode_ci',
    })
    password: string;

    @Column({
        type: 'varchar',
        length: 255,
        charset: 'utf8mb4',
        collation: 'utf8mb4_unicode_ci',
    })
    phone: string;

    @Column()
    role: number;

    @Column({ nullable: true })
    refresh_token: string;

    @Column({ type: "timestamp", default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date

    @Column({ type: "timestamp", default: () => 'CURRENT_TIMESTAMP', name: 'updated_at' })
    updated_at: Date

    @OneToOne(() => Restaurant, restaurant => restaurant.user)
    restaurant: Restaurant

    @OneToMany(() => UserAddress, user_address => user_address.user)
    user_address: UserAddress[]

    @OneToMany(() => Order, order => order.user)
    order: Order[]

    @OneToMany(() => Order, order_driver => order_driver.driver)
    order_driver: Order[]
    @OneToMany(() => Order, order_driver => order_driver.driver)
    order_res: Order[]

    @OneToMany(() => Order, order_restaurant => order_restaurant.restaurant)
    order_restaurant: Order[]

    @OneToMany(() => Cart, cart => cart.user)
    cart: Cart[]

    @OneToMany(() => Product, product => product.user)
    product: Product[]

    @OneToMany(() => Category, category => category.user)
    category: Category[]

    @OneToMany(() => Voucher, voucher => voucher.user)
    voucher: Voucher[]
}

