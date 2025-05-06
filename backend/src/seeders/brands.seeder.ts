import dotenv from "dotenv";
import logger from "../utils/logger";
import CarBrand, { ICarBrandBase } from "../models/carBrand.model";
import { connectDB } from "../config/database.config";

dotenv.config();

const seedBrands = async () => {
    const shouldReset =
        process.argv.includes("--reset") || process.argv.includes("--r");

    try {
        await connectDB();

        if (shouldReset) {
            await CarBrand.deleteMany({});
            logger.debug("Resetting the Brand collection data");
        }

        const brands: ICarBrandBase[] = [
            { name: "Toyota" },
            { name: "Honda" },
            { name: "Ford" },
        ];

        await CarBrand.insertMany(brands);
        logger.debug("Brands inserted correctly");
        process.exit(0);
    } catch (error) {
        logger.debug(`Error inserting brands`);
        logger.error(error);
        process.exit(1);
    }
};

seedBrands();
