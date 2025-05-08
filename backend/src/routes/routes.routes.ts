import { Router } from "express";
import RouteController from "../controllers/route.controller";
import { validateCreateRoute } from "../validation/route.validation";

const routeRoutes = Router();

routeRoutes.get("/vehicle/:id", RouteController.getLastRouteByVehicleId);

routeRoutes.post("/", validateCreateRoute, RouteController.createRoute);

export default routeRoutes;
