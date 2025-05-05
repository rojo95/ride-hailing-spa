import { Router } from "express";
import UserController from "../controllers/user.controller";

const userRoutes = Router();

userRoutes.get("/", UserController.all);
userRoutes.get("/me", UserController.myself);

export default userRoutes;
