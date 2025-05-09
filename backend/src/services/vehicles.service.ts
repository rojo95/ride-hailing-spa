import { Types } from "mongoose";
import Vehicle, { IVehicle } from "../models/vehicle.model";
import { RegisterVehicleRequest } from "../types/vehicle";
import Route from "../models/route.model";

export default class VehicleService {
    static async getAllVehicles() {
        const vehicles = await Vehicle.find({})
            .populate({
                path: "model_id",
                populate: { path: "brand_id" },
            })
            .populate("driver_id")
            .sort({ createdAt: -1 });

        return vehicles;
    }

    static async create({
        plate,
        model_id,
        year,
        color,
        capacity,
        picture,
        driver_id,
    }: RegisterVehicleRequest): Promise<IVehicle> {
        const existingVehicle = await Vehicle.findOne({ plate });

        if (existingVehicle) {
            throw new Error("El vehículo con esta matrícula ya existe.");
        }

        const vehicle = new Vehicle({
            plate,
            model_id,
            year,
            color,
            capacity,
            picture,
            driver_id,
        });

        await vehicle.save();

        return vehicle.toObject();
    }

    static async vehicleById(
        _id: Types.ObjectId
    ): Promise<IVehicle | undefined> {
        const vehicle = await Vehicle.findOne({ _id })
            .populate({
                path: "model_id",
                populate: { path: "brand_id" },
            })
            .populate("driver_id");

        if (!vehicle) return;

        const routes = await Route.find({ vehicle_id: _id }).sort({
            createdAt: -1,
        });

        const vehicleWithRoutes: IVehicle = vehicle.toObject();
        vehicleWithRoutes.routes = routes;

        return vehicleWithRoutes;
    }

    static async getAllVehiclesWithLastRoute() {
        const vehicles = await Vehicle.find({})
            .populate({
                path: "model_id",
                populate: { path: "brand_id" },
            })
            .populate("driver_id")
            .sort({ createdAt: -1 });

        const results = await Promise.all(
            vehicles.map(async (vehicle) => {
                // Buscar la última ruta para cada vehículo, ordenando por `createdAt` de forma descendente
                const lastRoute = await Route.findOne({
                    vehicle_id: vehicle._id,
                }).sort({ createdAt: -1 }); // Obtiene la última ruta

                return {
                    ...vehicle.toObject(),
                    lastRoute, // Incluye la última ruta en el objeto del vehículo
                };
            })
        );

        return results;
    }
}
