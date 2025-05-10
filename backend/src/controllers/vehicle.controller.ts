import { Request, Response } from "express";
import { handleErrorMessage } from "../utils/handleErrorMessage";
import VehicleService from "../services/vehicles.service";
import DriverService from "../services/driver.service";
import { RegisterVehicleRequest } from "../types/vehicle";
import { RegisterDriverRequest } from "../types/driver";
import path from "path";
import FileService from "../services/file.service";
import { Types } from "mongoose";
import { decodeTokenFromRequest } from "../utils/decodeToken";

type RegisterVehicleDriverRequest = RegisterDriverRequest &
    RegisterVehicleRequest;

export default class VehicleController {
    static async all(req: Request, res: Response): Promise<void> {
        try {
            const page = parseInt(req.params.page as string) || 1;
            const limit = parseInt(req.params.limit as string) || 10;
            const offset = (page - 1) * limit;

            const { vehicles, total } =
                await VehicleService.getAllVehiclesWithLastRoute({
                    limit,
                    offset,
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
        } = req.body;

        let driverId: Types.ObjectId | null = null;

        try {
            const { id: authId } = decodeTokenFromRequest(req);

            if (!authId) throw Error("No se ha obtenido id de usuario");

            const driver = await DriverService.create({
                idCard,
                name,
                lastname,
                licenseExpiry,
                avatar,
                createdBy: authId,
            });

            if (!driver._id) throw Error("Error al registrar al conductor");

            driverId = driver._id;

            const vehicle = await VehicleService.create({
                plate,
                model_id,
                year,
                color,
                capacity,
                picture,
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
}
