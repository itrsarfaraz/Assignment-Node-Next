import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { authMiddleware, adminMiddleware } from "../middleware/auth.middleware";

const router = Router();
const productController = new ProductController();

router.get("/", productController.getAll);
router.get("/:id", productController.getOne);
router.post("/", [authMiddleware, adminMiddleware], productController.create);

export default router;
