import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";
import { Product } from "./Product";

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    user_id: number;

    @Column()
    product_id: number;

    @Column({
        type: "int",
        default: 1
    })
    quantity: number;

    @Column({
        type: "decimal",
        precision: 10,
        scale: 2
    })
    total_price: any;

    @ManyToOne(() => User, user => user.orders)
    @JoinColumn({ name: "user_id" })
    user: User;

    @ManyToOne(() => Product, product => product.orders)
    @JoinColumn({ name: "product_id" })
    product: Product;

    @CreateDateColumn()
    order_date: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
