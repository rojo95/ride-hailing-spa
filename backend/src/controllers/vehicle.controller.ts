import { Request, Response } from "express";
import { handleErrorMessage } from "../utils/handleErrorMessage";
import VehicleService from "../services/vehicles.service";
import DriverService from "../services/driver.service";
import { RegisterVehicleRequest, UpdateVehicleRequest } from "../types/vehicle";
import { RegisterDriverRequest, UpdateDriverRequest } from "../types/driver";
import path from "path";
import FileService from "../services/file.service";
import { Types } from "mongoose";
import { decodeTokenFromRequest } from "../utils/decodeToken";
import RouteService from "../services/route.service";
import { STATUSES } from "../constants/vehicle";
import { STATUSES as ROUTE_STATUSES } from "../constants/routes";
import logger from "../utils/logger";
import { ITEMS_FILTER } from "../constants/filters";

type RegisterVehicleDriverRequest = RegisterDriverRequest &
    RegisterVehicleRequest;

type UpdateVehicleDRiverRequest = UpdateDriverRequest & UpdateVehicleRequest;

export default class VehicleController {
    static async all(req: Request, res: Response): Promise<void> {
        try {
            const page = parseInt(req.params.page as string) || 1;
            const limit = parseInt(req.params.limit as string) || 10;
            const filterBy =
                parseInt(req.params.filter as string) || ITEMS_FILTER.NEW;
            const offset = (page - 1) * limit;
            const search = req.query.search?.toString() || "";

            const { vehicles, total } =
                await VehicleService.getAllVehiclesWithLastRoute({
                    limit,
                    offset,
                    search,
                    filterBy,
                });

            res.status(200).json({
                data: vehicles,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                },
            });
        } catch (error) {
            res.status(500).json({
                error: handleErrorMessage({
                    error,
                    defaultMessage:
                        "Error inesperado al obtener vehículos paginados",
                }),
                fullError: error,
            });
        }
    }

    static async byId(req: Request<{ id: string }>, res: Response) {
        const { id } = req.params;

        const vehId = new Types.ObjectId(id);

        try {
            const vehicles = await VehicleService.vehicleById(vehId);

            res.status(200).json(vehicles);
        } catch (error) {
            res.status(500).json({
                error: handleErrorMessage({
                    error,
                    defaultMessage: "Error inesperado al obtener vehículos",
                }),
                fullError: error,
            });
        }
    }

    static async create(
        req: Request<{}, {}, RegisterVehicleDriverRequest>,
        res: Response
    ) {
        const {
            idCard,
            name,
            lastname,
            avatar,
            licenseExpiry,
            plate,
            model_id,
            year,
            color,
            capacity,
            picture,
            email,
            phone,
            status,
        } = req.body;

        let driverId: Types.ObjectId | null = null;

        try {
            const { id: authId } = decodeTokenFromRequest(req);

            if (!authId) throw Error("No se ha obtenido id de usuario");

            const driverExists = await DriverService.findManyByAnyField({
                email,
                idCard,
            });

            if (driverExists.length > 0)
                throw Error("El conductor ya se encuentra registrado");

            const driver = await DriverService.create({
                idCard,
                name,
                lastname,
                licenseExpiry,
                avatar,
                createdBy: authId,
                email,
                phone,
            });

            if (!driver._id) throw Error("Error al registrar al conductor");

            driverId = driver._id;

            const vehicleExists = await VehicleService.findManyByFields({
                plate,
            });

            if (vehicleExists.length > 0)
                throw Error("El vehículo ya se encuentra registrado");

            const vehicle = await VehicleService.create({
                plate,
                model_id,
                year,
                color,
                capacity,
                picture,
                status,
                driver_id: driverId,
                createdBy: authId,
            });

            res.status(200).json({ driver, vehicle });

            return;
        } catch (error) {
            const fileAvatar = path.basename(avatar);
            const filePicture = path.basename(picture);

            if (driverId) {
                await DriverService.delete(driverId);
            }

            await FileService.deleteFile(fileAvatar);
            await FileService.deleteFile(filePicture);

            res.status(500).json({
                error: handleErrorMessage({
                    error,
                    defaultMessage:
                        "Error inesperado al crear el vehículo o su conductor",
                }),
                fullError: error,
            });
        }
    }

    static async delete(
        req: Request<{}, {}, { id: Types.ObjectId }>,
        res: Response
    ) {
        const { id: vehicleId } = req.body;
        const { id: authId } = decodeTokenFromRequest(req);

        if (!authId) throw Error("No se ha obtenido id de usuario");

        let vehicleDeleted = false;
        let routeStatusChanged = false;
        let originalRoute: Awaited<
            ReturnType<typeof RouteService.getLastRouteByVehicleId>
        > | null = null;

        try {
            const vehicle = await VehicleService.vehicleById(vehicleId);

            if (!vehicle) throw new Error("Vehículo no encontrado");

            if (vehicle.status === STATUSES.IN_SERVICE) {
                const route = await RouteService.getLastRouteByVehicleId(
                    vehicle._id
                );

                if (route?.status === ROUTE_STATUSES.ACTIVE) {
                    originalRoute = route;

                    await RouteService.updateStatus({
                        _id: route._id,
                        status: ROUTE_STATUSES.CANCELLED,
                        updatedBy: authId,
                    });

                    routeStatusChanged = true;
                }
            }

            await VehicleService.softDeleteById({
                _id: vehicle._id,
                deletedBy: authId,
            });

            res.status(200).json({
                message: "Vehículo y conductor eliminados correctamente",
            });
        } catch (error) {
            if (vehicleDeleted) {
                try {
                    await VehicleService.softRestoreById(vehicleId);
                } catch (rollbackError) {
                    logger.error(
                        "Fallo al hacer rollback del vehículo:",
                        rollbackError
                    );
                }
            }

            if (routeStatusChanged && originalRoute) {
                try {
                    await RouteService.updateStatus({
                        _id: originalRoute._id,
                        status: ROUTE_STATUSES.ACTIVE,
                        updatedBy: authId,
                    });
                } catch (rollbackError) {
                    logger.error(
                        "Fallo al hacer rollback de la ruta:",
                        rollbackError
                    );
                }
            }

            res.status(500).json({
                error: handleErrorMessage({
                    error,
                    defaultMessage:
                        "Error inesperado al eliminar el vehículo o su conductor",
                }),
                fullError: error,
            });
        }
    }

    static async update(
        req: Request<{ id: string }, {}, UpdateVehicleDRiverRequest>,
        res: Response
    ) {
        const { id } = req.params;
        const {
            idCard,
            name,
            lastname,
            avatar,
            licenseExpiry,
            plate,
            model_id,
            year,
            color,
            capacity,
            picture,
            email,
            phone,
            status,
        } = req.body;

        try {
            const { id: authId } = decodeTokenFromRequest(req);

            if (!authId) throw Error("No se ha obtenido id de usuario");

            // Obtener el vehículo con su conductor
            const vehicle = await VehicleService.vehicleById(
                new Types.ObjectId(id)
            );
            if (!vehicle || !vehicle.driver_id) {
                throw new Error("Vehículo o conductor no encontrado");
            }

            // Actualizar conductor
            const driver = await DriverService.update(vehicle.driver_id._id, {
                idCard,
                name,
                lastname,
                licenseExpiry,
                email,
                phone,
                ...(avatar && { avatar }),
                updatedBy: authId,
            });

            if (!driver) throw Error("Error actualizando conductor");

            // Actualizar vehículo
            const vehicleUpdated = await VehicleService.update(vehicle._id, {
                plate,
                model_id,
                year,
                color,
                capacity,
                status,
                ...(picture && { picture }),
                updatedBy: authId,
            });

            if (!vehicle) throw Error("Error actualizando vehículo");

            res.status(200).json({
                driver,
                vehicle: vehicleUpdated,
            });
        } catch (error) {
            res.status(500).json({
                error: handleErrorMessage({
                    error,
                    defaultMessage:
                        "Error inesperado al actualizar vehículo y conductor",
                }),
                fullError: error,
            });
        }
    }

    static async updateStatus(
        req: Request<{ id: string }, {}, { status: number }>,
        res: Response
    ) {
        try {
            const { id } = req.params;
            const vehicleId = new Types.ObjectId(id);
            const { status } = req.body;
            const { id: authId } = decodeTokenFromRequest(req);

            if (!authId) throw Error("No se ha obtenido id de usuario");

            const vehicle = await VehicleService.vehicleById(vehicleId);
            if (!vehicle) {
                throw new Error("Vehículo no encontrado");
            }

            const updated = await VehicleService.updateStatus({
                id: vehicleId,
                status: status,
                updatedBy: authId,
            });

            res.status(200).json(updated);
        } catch (error) {
            res.status(500).json({
                error: handleErrorMessage({
                    error,
                    defaultMessage:
                        "Error inesperado al actualizar estado del vehículo",
                }),
                fullError: error,
            });
        }
    }
}
