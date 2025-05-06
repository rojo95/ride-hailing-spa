import { Router } from "express";
import VehicleController from "../controllers/vehicle.controller";

const vehicleRoutes = Router();

vehicleRoutes.get("/", VehicleController.all);

export default vehicleRoutes;
