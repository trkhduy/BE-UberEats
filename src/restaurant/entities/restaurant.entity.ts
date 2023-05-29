
import { Order } from "src/oder/entities/order.entity";
import { User } from "src/user/entities/user.entity";
import { Voucher } from "src/voucher/entities/voucher.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
@Entity('restaurant')
export class Restaurant {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({
        type: 'varchar',
        length: 255,
        charset: 'utf8mb4',
        collation: 'utf8mb4_unicode_ci',
    })
    address: string;

    @Column()
    opentime: string;

    @Column()
    endtime: string;

    @Column({ type: "timestamp", default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date

    @Column({ type: "timestamp", default: () => 'CURRENT_TIMESTAMP' })
    update_at: Date

    @OneToOne(() => User, user => user.restaurant)
    @JoinColumn()
    user: User
    
    @OneToOne(() => Order, order => order.restaurant)
    order: Order



}

