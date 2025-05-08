import { Router } from "express";
import CarBrandController from "../controllers/carBrand.controller";

const brandRoutes = Router();

brandRoutes.get("/", CarBrandController.all);

export default brandRoutes;
