import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { AuthRequest } from "../middleware/auth.middleware";

const router = Router();
const userRepository = AppDataSource.getRepository(User);

router.get("/profile", authMiddleware, async (req: AuthRequest, res) => {
    try {
        const user = await userRepository.findOne({
            where: { id: req.user!.id },
            relations: ["role"],
            select: ["id", "username", "email", "created_at"]
        });
        
        return res.json(user);
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
});

export default router;
