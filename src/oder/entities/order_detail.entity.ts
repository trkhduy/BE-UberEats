
import { Product } from "src/product/entities/product.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";
import { Voucher } from "src/voucher/entities/voucher.entity";
@Entity('order_detail')
export class OrderDetail {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    price: number
    @Column()
    quantity: number

    @OneToOne(() => Product, product => product.order_detail)
    @JoinColumn()
    product: Product
    @OneToOne(() => Order, order => order.order_detail)
    @JoinColumn()
    order: Order
    @ManyToOne(() => Voucher, voucher => voucher.order_detail)

    voucher: Voucher

}
