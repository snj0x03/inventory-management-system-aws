import express from "express";
import { getTotalProductCount, getTotalRevenue, getTotalStockCount, getLowStockProducts, getZeroStockProducts } from "../controllers/dashboardController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/totalProducts", authenticateToken, getTotalProductCount);
router.get("/totalStock", authenticateToken, getTotalStockCount);
router.get("/totalRevenue", getTotalRevenue);
router.get("/lowStock", getLowStockProducts);
router.get("/zeroStock", getZeroStockProducts);

export default router;
