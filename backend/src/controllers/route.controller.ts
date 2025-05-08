import { Types } from "mongoose";
import RouteService from "../services/route.service";
import { Request, Response } from "express";
import logger from "../utils/logger";
import { handleErrorMessage } from "../utils/handleErrorMessage";
import VehicleService from "../services/vehicles.service";
import { IRoute, IRouteBase } from "../models/route.model";
import { STATUSES } from "../constants/routes";

export default class RouteController {
    static async getLastRouteByVehicleId(
        req: Request<{ id: Types.ObjectId }, {}, {}>,
        res: Response
    ): Promise<void> {
        const { id } = req.params;

        try {
            const vehicle = await VehicleService.vehicleById(id);

            if (!vehicle) throw Error("Vehículo no encontrado");

            const route = await RouteService.getLastRouteByVehicleId(
                vehicle._id
            );
            res.status(200).json(route);
        } catch (error) {
            logger.debug(`Error getting users: ${req.originalUrl}`);
            logger.error(error);

            res.status(500).json({
                error: handleErrorMessage({
                    error,
                    defaultMessage: "Error inesperado al obtener ruta.",
                }),
                fullError: error,
            });
        }
    }

    static async createRoute(req: Request<{}, {}, IRouteBase>, res: Response) {
        const { from, to, status, vehicle_id } = req.body;

        try {
            const vehicle = await VehicleService.vehicleById(vehicle_id);
            if (!vehicle) throw Error("Vehículo no encontrado");

            const currentRoute = await RouteService.getLastRouteByVehicleId(
                vehicle._id
            );

            if (currentRoute?.status === STATUSES.ACTIVE) {
                throw Error(
                    "No se puede crear nueva ruta ya que hay una activa"
                );
            }

            const route = await RouteService.create({
                from,
                to,
                status,
                vehicle_id,
            });
            res.status(200).json(route);
        } catch (error) {
            logger.debug(`Error crating route: ${req.originalUrl}`);
            logger.error(error);

            res.status(500).json({
                error: handleErrorMessage({
                    error,
                    defaultMessage: "Error inesperado al obtener ruta.",
                }),
                fullError: error,
            });
        }
    }
}
