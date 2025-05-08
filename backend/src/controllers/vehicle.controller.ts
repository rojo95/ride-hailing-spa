import { Request, Response } from "express";
import { handleErrorMessage } from "../utils/handleErrorMessage";
import VehicleService from "../services/vehicles.service";
import DriverService from "../services/driver.service";
import { RegisterVehicleRequest } from "../types/vehicle";
import { RegisterDriverRequest } from "../types/driver";
import logger from "../utils/logger";
import path from "path";
import FileService from "../services/file.service";
import { Types } from "mongoose";

type RegisterVehicleDriverRequest = RegisterDriverRequest &
    RegisterVehicleRequest;

export default class VehicleController {
    static async all(_: Request, res: Response): Promise<void> {
        try {
            const vehicles = await VehicleService.getAllVehicles();
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
        let driver = null;
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
            const driver = await DriverService.create({
                idCard,
                name,
                lastname,
                licenseExpiry,
                avatar,
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
