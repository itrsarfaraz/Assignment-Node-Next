import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";

export interface AuthRequest extends Request {
    user?: User;
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Authentication required" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ 
            where: { id: decoded.id },
            relations: ["role"]
        });

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

export const adminMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.user || req.user.role.name !== "admin") {
            return res.status(403).json({ message: "Admin access required" });
        }
        next();
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};
