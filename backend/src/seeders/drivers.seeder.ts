import { Types } from "mongoose";
import dotenv from "dotenv";
import Vehicle from "../models/vehicle.model";
import Driver, { IDriver } from "../models/driver.model";
import logger from "../utils/logger";
import { connectDB } from "../config/database.config";
import CarModel from "../models/carModel.model";

dotenv.config();

const seedVehiclesAndDrivers = async () => {
    const shouldReset =
        process.argv.includes("--reset") || process.argv.includes("--r");

    let insertedDriverIds: Types.ObjectId[] = [];

    try {
        await connectDB();

        if (shouldReset) {
            logger.debug("Resetting the Drivers collection data");
            await Driver.deleteMany({});
            logger.debug("Resetting the Vehicles collection data");
            await Vehicle.deleteMany({});
        }

        // Obtener los modelos de vehículos existentes
        const vehicleModels = await CarModel.find({}, "_id name"); // Asegúrate de que el campo 'name' sea el correcto
        const vehicleModelMap = new Map(
            vehicleModels.map((model) => [model.name, model._id])
        );

        const drivers = [
            {
                idCard: "V-12345678",
                name: "Jose Gonzales",
                avatar: "https://randomuser.me/api/portraits/men/85.jpg",
                rating: 4.5,
                licenseExpiry: new Date("2024-12-31"),
            },

            {
                idCard: "V-234567890",
                name: "María Requena",
                avatar: "https://randomuser.me/api/portraits/women/86.jpg",
                rating: 4.7,
                licenseExpiry: new Date("2024-06-30"),
            },
            {
                idCard: "V-345678901",
                name: "Roberto Gómez",
                avatar: "https://randomuser.me/api/portraits/men/87.jpg",
                rating: 4.8,
                licenseExpiry: new Date("2025-01-15"),
            },
        ];

        const insertedDrivers: IDriver[] = await Driver.insertMany(drivers);
        if (!insertedDrivers) return;
        insertedDriverIds = insertedDrivers.map((driver) => driver._id); // Almacenar los IDs de los conductores
        logger.info("Drivers inserted successfully");

        const vehicles = [
            {
                plate: "ABC123",
                model_id: vehicleModelMap.get("Corolla")?._id,
                year: new Date(2018, 0),
                color: "Blanco",
                capacity: 4,
                driver_id: insertedDrivers[0]._id,
                status_id: 3,
            },
            {
                plate: "DEF456",
                model_id: vehicleModelMap.get("Civic")?._id,
                year: new Date(2020, 0),
                color: "Negro",
                capacity: 4,
                driver_id: insertedDrivers[1]._id,
                status_id: 1,
            },
            {
                plate: "GHI789",
                model_id: vehicleModelMap.get("Focus")?._id,
                year: new Date(2019, 0),
                color: "Rojo",
                capacity: 5,
                driver_id: insertedDrivers[2]._id,
                status_id: 2,
            },
        ];

        // Insertar los vehículos
        await Vehicle.insertMany(vehicles);
        logger.info("Vehicles inserted successfully");
        process.exit(0);
    } catch (error) {
        logger.debug(`Error inserting vehicles`);
        logger.error(error);

        if (insertedDriverIds.length > 0) {
            await Driver.deleteMany({ _id: { $in: insertedDriverIds } });
            logger.debug("Removed inserted drivers due to error");
        }

        process.exit(1);
    }
};

seedVehiclesAndDrivers();
