import { Router } from "express";
import RouteController from "../controllers/route.controller";
import {
    validateCreateRoute,
    validateUpdateRouteStatus,
} from "../validation/route.validation";

const routeRoutes = Router();

routeRoutes.get("/vehicle/:id", RouteController.getLastRouteByVehicleId);

routeRoutes.post("/", validateCreateRoute, RouteController.createRoute);

routeRoutes.put(
    "/",
    validateUpdateRouteStatus,
    RouteController.updateStatusRoute
);

export default routeRoutes;
