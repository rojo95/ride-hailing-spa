import { Router } from "express";
import VehicleController from "../controllers/vehicle.controller";
import {
    validateRegisterVehicleDriver,
    validateSoftDeleteVehicle,
    validateUpdateVehicleDriver,
    validateUpdateVehicleStatus,
    validateVehicleIdParam,
    validateVehiclePaginationParams,
} from "../validation/vehicleDriverRegister.validation";

const vehicleRoutes = Router();

vehicleRoutes.get(
    "/:page/:limit/:filter",
    validateVehiclePaginationParams,
    VehicleController.all
);

vehicleRoutes.get("/:id", validateVehicleIdParam, VehicleController.byId);

vehicleRoutes.put(
    "/:id",
    validateVehicleIdParam,
    validateUpdateVehicleDriver,
    VehicleController.update
);

vehicleRoutes.put(
    "/status/:id",
    validateVehicleIdParam,
    validateUpdateVehicleStatus,
    VehicleController.updateStatus
);

vehicleRoutes.post(
    "/",
    validateRegisterVehicleDriver,
    VehicleController.create
);

vehicleRoutes.delete("/", validateSoftDeleteVehicle, VehicleController.delete);

export default vehicleRoutes;
