import { Restaurant } from "src/restaurant/entities/restaurant.entity";
import { BeforeInsert, Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";


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
    })
    address: string;



    @Column({
        type: 'varchar',
        length: 255,
        charset: 'utf8mb4',
        collation: 'utf8mb4_unicode_ci',
    })
    password: string

    @Column({
        type: 'varchar',
        length: 255,
        charset: 'utf8mb4',
        collation: 'utf8mb4_unicode_ci',
    })
    phone: string;

    @Column({
        type: 'varchar',
        length: 255,
        charset: 'utf8mb4',
        collation: 'utf8mb4_unicode_ci',
    })
    email: string;

    @Column({
        type: 'varchar',
        length: 255,
        charset: 'utf8mb4',
        collation: 'utf8mb4_unicode_ci',
    })
    avatar: string;

    @Column()
    role: number;

    @Column()
    rf_token: string;

    @Column({ type: "timestamp", default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date

    @Column({ type: "timestamp", default: () => 'CURRENT_TIMESTAMP' })
    update_at: Date

    @OneToOne(() => Restaurant, restaurant => restaurant.user)
    restaurant: Restaurant
}

