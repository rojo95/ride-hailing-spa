import { Types } from "mongoose";
import RouteService from "../services/route.service";
import { Request, Response } from "express";
import logger from "../utils/logger";
import { handleErrorMessage } from "../utils/handleErrorMessage";
import VehicleService from "../services/vehicles.service";
import { IRouteBase, IRouteUpdateStatus } from "../models/route.model";
import { STATUSES } from "../constants/routes";
import jwt, { JwtPayload } from "jsonwebtoken";
import { jwtConfig } from "../config/jwt.config";

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

        try {
            const token = req.header("Authorization")?.replace("Bearer ", "");
            if (!req.user || !token) throw new Error("Sesión no iniciada");

            const decoded = jwt.verify(token, jwtConfig.secret);

            if (typeof decoded !== "object" || !("id" in decoded)) {
                throw new Error("Token inválido");
            }

            if (decoded) logger.debug(decoded.id);

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
                from_address,
                to_address,
                status,
                vehicle_id,
                createdBy: decoded.id,
            });
            res.status(200).json(route);
        } catch (error) {
            logger.debug(`Error creating route: ${req.originalUrl}`);
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

    static async updateStatusRoute(
        req: Request<{}, {}, IRouteUpdateStatus>,
        res: Response
    ) {
        const { _id, status } = req.body;
        try {
            const route = await RouteService.getById(_id);

            if (!route) throw Error("La ruta no existe");

            const updated = await RouteService.updateStatus({
                _id: route._id,
                status,
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
