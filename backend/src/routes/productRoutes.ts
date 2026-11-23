import express from "express";
import { createProduct, getProducts } from "../controllers/productController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/add", authenticateToken, createProduct);
router.get("/", authenticateToken, getProducts);

export default router;

