
import { Restaurant } from "src/restaurant/entities/restaurant.entity";
import { StatusOder } from "src/status_oder/entities/status_oder.entity";
import { User } from "src/user/entities/user.entity";
import { UserAddress } from "src/user_address/entities/user_address.entity";
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { OrderDetail } from "./order_detail.entity";
@Entity('order')
@Index(['driver', 'user'])
export class Order {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({
        type: 'varchar',
        length: 255,
        charset: 'utf8mb4',
        collation: 'utf8mb4_unicode_ci',
    })
    note: string

    @ManyToOne(() => User, user => user.order)
    user: User
    @OneToOne(() => UserAddress, user_address => user_address.order)
    @JoinColumn()
    user_address: UserAddress
    @OneToOne(() => Restaurant, restaurant => restaurant.order)
    @JoinColumn()
    restaurant: Restaurant
    @ManyToOne(() => User, driver => driver.order_driver)
    // @JoinColumn()
    driver: User
    @OneToOne(() => StatusOder, status => status.order)
    @JoinColumn()
    status: StatusOder
    @OneToOne(() => OrderDetail, order_detail => order_detail.order)
    order_detail: OrderDetail
}
