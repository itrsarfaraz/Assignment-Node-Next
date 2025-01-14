import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { User } from "./User";

export enum RoleType {
    USER = "user",
    ADMIN = "admin"
}

@Entity()
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "enum",
        enum: RoleType,
        default: RoleType.USER
    })
    name: RoleType;

    @Column({
        type: "varchar",
        length: 255,
        nullable: true
    })
    description: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @OneToMany(() => User, user => user.role)
    users: User[];
}
