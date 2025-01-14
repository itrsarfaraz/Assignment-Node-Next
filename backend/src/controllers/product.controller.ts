import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Product } from "../entities/Product";
import { CreateProductDTO } from "../lib/validators";
import { validate } from "class-validator";
import { AuthRequest } from "../middleware/auth.middleware";

export class ProductController {
    private productRepository = AppDataSource.getRepository(Product);

    public create = async (req: AuthRequest, res: Response) => {
        try {
            const productDto = new CreateProductDTO();
            Object.assign(productDto, req.body);

            const errors = await validate(productDto);
            if (errors.length > 0) {
                return res.status(400).json({ errors });
            }

            const product = this.productRepository.create({
                name: productDto.name,
                description: productDto.description,
                price: productDto.price,
                stock: productDto.stock
            });

            await this.productRepository.save(product);
            return res.status(201).json(product);
        } catch (error) {
            return res.status(500).json({ message: "Server error" });
        }
    };

    public getAll = async (_req: Request, res: Response) => {
        try {
            const products = await this.productRepository.find();
            return res.json(products);
        } catch (error) {
            return res.status(500).json({ message: "Server error" });
        }
    };

    public getOne = async (req: Request, res: Response) => {
        try {
            const product = await this.productRepository.findOne({
                where: { id: parseInt(req.params.id) }
            });

            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }

            return res.json(product);
        } catch (error) {
            return res.status(500).json({ message: "Server error" });
        }
    };
}
