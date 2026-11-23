import express from "express";
import cors from "cors";
import "dotenv/config";

import loginRoutes from "./routes/loginRoutes";
import registerRoutes from "./routes/registerRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import productRoutes from "./routes/productRoutes";
import orderRoutes from "./routes/orderRoutes";
import { authenticateToken } from "./middleware/authMiddleware";

const app = express();

app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use("/api/auth", loginRoutes);
app.use("/api/auth", registerRoutes);
app.use("/api/dashboard", authenticateToken, dashboardRoutes);
app.use("/api/inventory", productRoutes);
app.use("/api/order", orderRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});

