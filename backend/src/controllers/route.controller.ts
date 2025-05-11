import { Types } from "mongoose";
import RouteService from "../services/route.service";
import { Request, Response } from "express";
import logger from "../utils/logger";
import { handleErrorMessage } from "../utils/handleErrorMessage";
import VehicleService from "../services/vehicles.service";
import { IRouteBase, IRouteUpdateStatus } from "../models/route.model";
import { STATUSES } from "../constants/routes";
import { STATUSES as VEHICLE_STATUSES } from "../constants/vehicle";
import { decodeTokenFromRequest } from "../utils/decodeToken";

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
            logger.debug(`Error getting vehicles: ${req.originalUrl}`);
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
        const { from, to, status, from_address, to_address, vehicle_id } =
            req.body;

        let routeId = null;

        try {
            const { id: authId } = decodeTokenFromRequest(req);

            if (!authId) throw Error("No se ha obtenido id de usuario");

            const vehicle = await VehicleService.vehicleById(vehicle_id);
            if (!vehicle) throw Error("Vehículo no encontrado");

            const currentRoute = await RouteService.getLastRouteByVehicleId(
                vehicle._id
            );

            if (
                vehicle.status === VEHICLE_STATUSES.MAINTENANCE ||
                currentRoute?.status === STATUSES.ACTIVE
            ) {
                throw Error(
                    "El vehículo no se encuentra disponible para asignarle una nueva ruta"
                );
            }

            const route = await RouteService.create({
                from,
                to,
                from_address,
                to_address,
                status,
                vehicle_id,
                createdBy: authId,
            });

            routeId = route._id;

            await VehicleService.updateStatus({
                id: vehicle_id,
                status:
                    route.status !== STATUSES.ACTIVE
                        ? VEHICLE_STATUSES.IN_SERVICE
                        : VEHICLE_STATUSES.AVAILABLE,
                updatedBy: authId,
            });
            res.status(200).json(route);
        } catch (error) {
            logger.debug(`Error creating route: ${req.originalUrl}`);
            logger.error(error);

            if (routeId) await RouteService.deleteById(routeId);

            res.status(500).json({
                error: handleErrorMessage({
                    error,
                    defaultMessage: "Error inesperado al obtener ruta.",
                }),
                fullError: error,
            });
        }
    }

    static async updateStatusRoute(
        req: Request<{}, {}, IRouteUpdateStatus>,
        res: Response
    ) {
        const { _id, status } = req.body;
        try {
            const { id: authId } = decodeTokenFromRequest(req);

            if (!authId) throw Error("No se ha obtenido id de usuario");

            const route = await RouteService.getById(_id);

            if (!route || route?.status !== STATUSES.ACTIVE)
                throw Error("No existe una ruta valida");

            const vehicle = await VehicleService.vehicleById(route.vehicle_id);
            if (!vehicle) throw Error("Vehículo no encontrado");

            if (!vehicle.status) {
                throw Error(
                    "El vehículo no se encuentra disponible para asignarle una nueva ruta"
                );
            }

            const updated = await RouteService.updateStatus({
                _id: route._id,
                status,
                updatedBy: authId,
            });

            res.status(200).json(updated);

            return;
        } catch (error) {
            logger.debug(`Error updating route: ${req.originalUrl}`);
            logger.error(error);

            res.status(500).json({
                error: handleErrorMessage({
                    error,
                    defaultMessage:
                        "Error inesperado al actualizar estatus de ruta.",
                }),
                fullError: error,
            });
        }
    }
}
