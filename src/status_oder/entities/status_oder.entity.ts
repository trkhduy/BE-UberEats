import { Order } from "src/oder/entities/order.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('status_oder')
export class StatusOder {
    @PrimaryGeneratedColumn()
    id: number
    @Column({
        type: 'varchar',
        length: 255,
        charset: 'utf8mb4',
        collation: 'utf8mb4_unicode_ci',
    })
    name: string
    @Column({
        type: 'varchar',
        length: 255,
        charset: 'utf8mb4',
        collation: 'utf8mb4_unicode_ci',
    })
    role: string
    @OneToOne(()=>Order,order=>order.status)
   
    order: Order
}
