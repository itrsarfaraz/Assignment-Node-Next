import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { Role } from "./Role";
import { Order } from "./Order";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "varchar",
        length: 50
    })
    username: string;

    @Column({
        type: "varchar",
        length: 100,
        unique: true
    })
    email: string;

    @Column({
        type: "varchar",
        length: 100
    })
    password: string;

    @Column()
    role_id: number;

    @ManyToOne(() => Role, role => role.users)
    @JoinColumn({ name: "role_id" })
    role: Role;

    @OneToMany(() => Order, order => order.user)
    orders: Order[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
