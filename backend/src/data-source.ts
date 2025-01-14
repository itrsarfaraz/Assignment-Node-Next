import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Role } from "./entities/Role";
import { Product } from "./entities/Product";
import { Order } from "./entities/Order";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306"),
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "root",
    database: process.env.DB_NAME || "ecommerce_db",
    synchronize: true,
    logging: false,
    entities: [User, Role, Product, Order],
    migrations: [],
    subscribers: [],
});
