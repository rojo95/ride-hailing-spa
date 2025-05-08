import { Types } from "mongoose";
import Vehicle, { IVehicle } from "../models/vehicle.model";
import { RegisterVehicleRequest } from "../types/vehicle";

export default class VehicleService {
    static async getAllVehicles() {
        const users = await Vehicle.find({})
            .populate({
                path: "model_id",
                populate: { path: "brand_id" },
            })
            .populate("driver_id");

        return users;
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
}
