import { Request, Response } from "express";
import { handleErrorMessage } from "../utils/handleErrorMessage";
import VehicleService from "../services/vehicles.service";

export default class VehicleController {
    static async all(req: Request, res: Response): Promise<void> {
        try {
            const vehicles = await VehicleService.getAllVehicles();
            res.status(200).json(vehicles);
        } catch (error) {
            res.status(500).json({
                error: handleErrorMessage({
                    error,
                    defaultMessage: "Error inesperado al obtener usuarios.",
                }),
                fullError: error,
            });
        }
    }
}
