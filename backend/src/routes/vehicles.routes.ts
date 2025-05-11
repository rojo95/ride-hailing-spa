import { Router } from "express";
import VehicleController from "../controllers/vehicle.controller";
import {
    validateRegisterVehicleDriver,
    validateSoftDeleteVehicle,
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

vehicleRoutes.put("/:id", validateVehicleIdParam, VehicleController.update);

vehicleRoutes.post(
    "/",
    validateRegisterVehicleDriver,
    VehicleController.create
);

vehicleRoutes.delete("/", validateSoftDeleteVehicle, VehicleController.delete);

export default vehicleRoutes;
