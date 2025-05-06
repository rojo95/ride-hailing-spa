import { Request, Response, Router } from "express";
import authRoutes from "./auth.routes";
import dotenv from "dotenv";
import userRoutes from "./users.routes";
import authMiddleware from "../middlewares/auth.middleware";
import vehicleRoutes from "./vehicles.routes";
dotenv.config();

const router = Router();

// authentication routes
router.use("/auth", authRoutes);

// users routes
router.use("/users", authMiddleware, userRoutes);

// vehicles routes
router.use("/vehicles", authMiddleware, vehicleRoutes);

export default router;
