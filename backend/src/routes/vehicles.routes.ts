import { Router } from "express";
import VehicleController from "../controllers/vehicle.controller";
import { validateRegisterVehicleDriver } from "../validation/vehicleDriverRegister.validation";

const vehicleRoutes = Router();

vehicleRoutes.get("/", VehicleController.all);

vehicleRoutes.post(
    "/",
    validateRegisterVehicleDriver,
    VehicleController.create
);

export default vehicleRoutes;
