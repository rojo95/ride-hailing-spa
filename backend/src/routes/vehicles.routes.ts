import { Router } from "express";
import VehicleController from "../controllers/vehicle.controller";
import {
    validateRegisterVehicleDriver,
    validateVehicleIdParam,
    validateVehiclePaginationParams,
} from "../validation/vehicleDriverRegister.validation";

const vehicleRoutes = Router();

vehicleRoutes.get(
    "/:page/:limit",
    validateVehiclePaginationParams,
    VehicleController.all
);

vehicleRoutes.get("/:id", validateVehicleIdParam, VehicleController.byId);

vehicleRoutes.post(
    "/",
    validateRegisterVehicleDriver,
    VehicleController.create
);

export default vehicleRoutes;
