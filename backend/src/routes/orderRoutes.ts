import express from "express";
import { getUserOrders, addOrder } from "../controllers/orderController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/:userId", authenticateToken, getUserOrders);
router.post("/add", authenticateToken, addOrder);

export default router;

