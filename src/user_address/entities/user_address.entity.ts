import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('user_address')
export class UserAddress {

    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: 'varchar',
        length: 255,
        charset: 'utf8mb4',
        collation: 'utf8mb4_unicode_ci',
    })
    name_address: string


    @Column({
        type: 'varchar',
        length: 255,
        charset: 'utf8mb4',
        collation: 'utf8mb4_unicode_ci',
    })
    note: string


    @Column({
        type: 'varchar',
        length: 255,
        charset: 'utf8mb4',
        collation: 'utf8mb4_unicode_ci',
    })
    location: string

    @Column({
        type: 'varchar',
        length: 255,
        charset: 'utf8mb4',
        collation: 'utf8mb4_unicode_ci',
    })
    phone: string;
    @ManyToOne(() => User, (user) => user.user_address)
    user: User
}
