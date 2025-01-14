import { Response } from "express";
import { AppDataSource } from "../data-source";
import { Order } from "../entities/Order";
import { Product } from "../entities/Product";
import { CreateOrderDTO } from "../lib/validators";
import { validate } from "class-validator";
import { AuthRequest } from "../middleware/auth.middleware";

export class OrderController {
    private orderRepository = AppDataSource.getRepository(Order);
    private productRepository = AppDataSource.getRepository(Product);

    public create = async (req: AuthRequest, res: Response) => {
        try {
            const orderDto = new CreateOrderDTO();
            Object.assign(orderDto, req.body);

            const errors = await validate(orderDto);
            if (errors.length > 0) {
                return res.status(400).json({ errors });
            }

            const product = await this.productRepository.findOne({
                where: { id: orderDto.productId }
            });

            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }

            if (product.stock < orderDto.quantity) {
                return res.status(400).json({ message: "Insufficient stock" });
            }

            const totalPrice = product.price * orderDto.quantity;

            const order = this.orderRepository.create({
                user: req.user!,
                product,
                quantity: orderDto.quantity,
                total_price: totalPrice
            });

            // Update product stock
            product.stock -= orderDto.quantity;
            await this.productRepository.save(product);

            await this.orderRepository.save(order);
            return res.status(201).json(order);
        } catch (error) {
            return res.status(500).json({ message: "Server error" });
        }
    };

    public getUserOrders = async (req: AuthRequest, res: Response) => {
        try {
            const orders = await this.orderRepository.find({
                where: { user: { id: req.user!.id } },
                relations: ["product"],
                order: { order_date: "DESC" }
            });

            // Group orders by product and date
            const groupedOrders = orders.reduce((acc: any[], order) => {
                const orderDate = new Date(order.order_date).toLocaleDateString();
                const existingGroup = acc.find(
                    group => 
                        group.product.id === order.product.id && 
                        group.order_date === orderDate
                );

                if (existingGroup) {
                    existingGroup.quantity += order.quantity;
                    existingGroup.total_price = parseFloat(existingGroup.total_price) + parseFloat(order.total_price); // Ensure numeric addition
                    existingGroup.total_price = existingGroup.total_price.toFixed(2); // Format to 2 decimal places
                  } else {
                    acc.push({
                      id: order.id,
                      product: order.product,
                      quantity: order.quantity,
                      total_price: parseFloat(order.total_price).toFixed(2), // Ensure numeric format
                      order_date: orderDate,
                    });
                  }
                  
                return acc;
            }, []);

            return res.json(groupedOrders);
        } catch (error) {
            return res.status(500).json({ message: "Server error" });
        }
    };
}
