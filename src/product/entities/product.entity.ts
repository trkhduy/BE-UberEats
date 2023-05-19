import { Category } from "src/category/entities/category.entity";
import { OrderDetail } from "src/oder/entities/order_detail.entity";
import { Restaurant } from "src/restaurant/entities/restaurant.entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('product')
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        length: 255,
        charset: 'utf8mb4',
        collation: 'utf8mb4_unicode_ci',
    })
    name: string;

    @Column()
    price: number;

    @Column()
    sale_price: number;
    @Column({
        type: 'varchar',
        length: 255,
        charset: 'utf8mb4',
        collation: 'utf8mb4_unicode_ci',
    })
    status: string;
    @Column({
        type: 'varchar',
        length: 255,
        charset: 'utf8mb4',
        collation: 'utf8mb4_unicode_ci',
    })
    slug: string;

    @Column({
        type: 'varchar',
        length: 255,
        charset: 'utf8mb4',
        collation: 'utf8mb4_unicode_ci',
    })
    description: string;


    @Column({ type: "varchar" })
    images: string

    @Column({ type: "timestamp", default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date

    @Column({ type: "timestamp", default: () => 'CURRENT_TIMESTAMP' })
    update_at: Date

    @ManyToOne(() => Restaurant, restaurant => restaurant.product)
    @JoinColumn()
    restaurant: Restaurant

    @ManyToOne(() => Category, category => category.product)
    category: Category
    @OneToOne(() => OrderDetail, order_detail => order_detail.product)
    order_detail: OrderDetail
}
