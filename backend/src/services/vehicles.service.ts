import { FilterQuery, Types } from "mongoose";
import Vehicle, { IVehicle } from "../models/vehicle.model";
import { RegisterVehicleRequest, UpdateVehicleService } from "../types/vehicle";
import Route from "../models/route.model";
import logger from "../utils/logger";
import { ITEMS_FILTER } from "../constants/filters";

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
        search,
        filterBy,
    }: {
        limit: number;
        offset: number;
        search?: string;
        filterBy: number;
    }) {
        // Buscar todos los vehículos con populate
        const allVehicles = await Vehicle.find({})
            .sort({ createdAt: -1 })
            .populate({
                path: "model_id",
                populate: { path: "brand_id" },
            })
            .populate("driver_id")
            .exec();

        const sortFieldMap: Record<number, (v: any) => any> = {
            1: (v) => v.year?.getFullYear(), // Año
            2: (v) => v.color,
            3: (v) => `${v.driver_id?.name} ${v.driver_id?.lastname}`,
            4: (v) => v.model_id?.brand_id?.name,
            5: (v) => -v.createdAt.getTime(), // Más nuevo (orden descendente)
            6: (v) => v.model_id?.name,
            7: (v) => v.plate,
        };

        // Filtrar en memoria si hay término de búsqueda
        let filteredVehicles = allVehicles;

        if (search) {
            const lowerSearch = search.toLowerCase();

            filteredVehicles = allVehicles.filter((vehicle) => {
                const driver = vehicle.driver_id as any;
                const model = vehicle.model_id as any;
                const brand = model?.brand_id as any;

                const valuesToSearch = [
                    vehicle.plate,
                    vehicle.year?.getFullYear().toString(),
                    driver?.name,
                    driver?.lastname,
                    model?.name,
                    brand?.name,
                    vehicle.color,
                ]
                    .filter(Boolean)
                    .map((val) => val.toString().toLowerCase());

                return valuesToSearch.some((val) => val.includes(lowerSearch));
            });
        }

        if (filterBy && sortFieldMap[filterBy]) {
            filteredVehicles.sort((a, b) => {
                const aVal = sortFieldMap[filterBy](a) ?? "";
                const bVal = sortFieldMap[filterBy](b) ?? "";

                if (filterBy === ITEMS_FILTER.NEW) return aVal - bVal;
                if (filterBy === ITEMS_FILTER.YEAR) return bVal - aVal;

                return aVal.toString().localeCompare(bVal.toString());
            });
        }

        const total = filteredVehicles.length;

        const paginatedVehicles = filteredVehicles.slice(
            offset,
            offset + limit
        );

        const results = await Promise.all(
            paginatedVehicles.map(async (vehicle) => {
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
        updatedBy,
    }: {
        id: Types.ObjectId;
        status: number;
        updatedBy: Types.ObjectId;
    }) {
        return await Vehicle.findByIdAndUpdate(
            id,
            { status, updatedBy },
            { new: true }
        );
    }

    static async softDeleteById({
        _id,
        deletedBy,
    }: {
        _id: Types.ObjectId;
        deletedBy: Types.ObjectId;
    }) {
        const vehicle = await Vehicle.findByIdAndUpdate(_id, {
            deletedAt: new Date(),
            deletedBy,
        });
        if (!vehicle) {
            throw new Error("Vehículo no encontrado");
        }

        const result = await vehicle.delete();
        return result;
    }

    static async softRestoreById(id: Types.ObjectId): Promise<boolean> {
        try {
            const result = await Vehicle.updateOne(
                { _id: id },
                { $unset: { deletedAt: null, deletedBy: null } }
            );
            return result.modifiedCount > 0;
        } catch (error) {
            throw new Error("Error al restaurar el vehículo");
        }
    }

    static async update(
        _id: Types.ObjectId,
        updates: UpdateVehicleService
    ): Promise<IVehicle> {
        try {
            const vehicle = await Vehicle.findByIdAndUpdate(
                _id,
                {
                    $set: {
                        ...updates,
                        updatedAt: new Date(),
                    },
                },
                { new: true }
            );

            if (!vehicle) throw new Error("Vehículo no encontrado");

            return vehicle.toObject();
        } catch (error) {
            logger.error("Error al actualizar vehículo:", error);
            throw new Error("No se pudo actualizar el vehículo");
        }
    }
}
