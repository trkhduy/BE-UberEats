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
    name: string;

    @Column({
        type: 'varchar',
        length: 255,
        charset: 'utf8mb4',
        collation: 'utf8mb4_unicode_ci',
    })
    address: string;

    @Column()
    email: string;

    @Column()
    phone: string;


    @Column({ type: "timestamp", default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date

    @Column({ type: "timestamp", default: () => 'CURRENT_TIMESTAMP' })
    update_at: Date

    @OneToOne(() => User, user => user.restaurant)
    @JoinColumn()
    user: User
    @OneToMany(() => Voucher, voucher => voucher.restaurant)
    voucher: Voucher[]


}

