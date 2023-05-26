import { Order } from "src/oder/entities/order.entity";
import { Product } from "src/product/entities/product.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('order_detail')
export class OrderDetail {
    @PrimaryGeneratedColumn()
    id: number;
   
    @Column()
    quantity: number

    @ManyToOne(() => Product, product => product.order_detail)
   
    product: Product

    @OneToOne(() => Order, order => order.order_detail)
    @JoinColumn()
    order: Order
    

}