import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Order } from "./Order";

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "varchar",
        length: 100
    })
    name: string;

    @Column({
        type: "text",
        nullable: true
    })
    description: string;

    @Column({
        type: "decimal",
        precision: 10,
        scale: 2
    })
    price: number;

    @Column({
        type: "int",
        default: 0
    })
    stock: number;

    @OneToMany(() => Order, order => order.product)
    orders: Order[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
