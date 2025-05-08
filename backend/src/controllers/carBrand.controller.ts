import { Request, Response } from "express";
import { handleErrorMessage } from "../utils/handleErrorMessage";
import CarBrandService from "../services/carBrand.service";

export default class CarBrandController {
    static async all(req: Request, res: Response): Promise<void> {
        try {
            const carBrands = await CarBrandService.getAllCarBrands();
            res.status(200).json(carBrands);
        } catch (error) {
            res.status(500).json({
                error: handleErrorMessage({
                    error,
                    defaultMessage: "Error inesperado al obtener las marcas.",
                }),
                fullError: error,
            });
        }
    }
}
