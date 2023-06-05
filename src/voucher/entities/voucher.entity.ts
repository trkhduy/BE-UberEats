import { Order } from "src/oder/entities/order.entity";

import { Restaurant } from "src/restaurant/entities/restaurant.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('voucher')
export class Voucher {
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
        type: 'float',
    })
    discount: number;

    @Column()
    conditions: number;

    @Column()
    code: string;

    @Column()
    quantity: number;

    @Column({
        type: 'varchar',
        length: 255,
        charset: 'utf8mb4',
        collation: 'utf8mb4_unicode_ci',
    })
    images: string;

    @Column({ type: "timestamp", default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date

    @Column({ type: "timestamp", default: () => 'CURRENT_TIMESTAMP' })
    update_at: Date

    @ManyToOne(() => User, user => user.voucher)
    user: User

    @OneToMany(() => Order, order => order.voucher)
    order: Order

}
