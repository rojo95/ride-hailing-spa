import { FilterQuery, Types } from "mongoose";
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
        status,
        driver_id,
        createdBy,
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
            status,
            driver_id,
            createdBy,
        });

        await vehicle.save();

        return vehicle.toObject();
    }

    static async findManyByFields(
        fields: FilterQuery<IVehicle>
    ): Promise<IVehicle[]> {
        const drivers = await Vehicle.find(fields);
        return drivers.map((vehicle) => vehicle.toObject());
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

    static async getAllVehiclesWithLastRoute({
        limit,
        offset,
    }: {
        limit: number;
        offset: number;
    }) {
        const [vehicles, total] = await Promise.all([
            Vehicle.find({})
                .sort({ createdAt: -1 })
                .populate({
                    path: "model_id",
                    populate: { path: "brand_id" },
                })
                .populate("driver_id")
                .skip(offset)
                .limit(limit),
            Vehicle.countDocuments(),
        ]);

        const results = await Promise.all(
            vehicles.map(async (vehicle) => {
                const lastRoute = await Route.findOne({
                    vehicle_id: vehicle._id,
                }).sort({ createdAt: -1 });

                return {
                    ...vehicle.toObject(),
                    lastRoute,
                };
            })
        );

        return {
            vehicles: results,
            total,
        };
    }

    static async updateStatus({
        id,
        status,
    }: {
        id: Types.ObjectId;
        status: number;
    }) {
        return await Vehicle.findByIdAndUpdate(id, { status }, { new: true });
    }
}
