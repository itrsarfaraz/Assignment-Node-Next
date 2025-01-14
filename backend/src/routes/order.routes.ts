import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();
const orderController = new OrderController();

router.post("/", authMiddleware, orderController.create);
router.get("/my-orders", authMiddleware, orderController.getUserOrders);

export default router;
