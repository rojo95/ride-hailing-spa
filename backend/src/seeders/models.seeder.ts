import dotenv from "dotenv";
import logger from "../utils/logger";
import { connectDB } from "../config/database.config";
import CarModel, { ICarModelBase } from "../models/carModel.model";
import CarBrand from "../models/carBrand.model";

dotenv.config();

const seedCarModels = async () => {
    const shouldReset =
        process.argv.includes("--reset") || process.argv.includes("--r");

    try {
        await connectDB();

        if (shouldReset) {
            logger.debug("Resetting the Models collection data");
            await CarModel.deleteMany({});
        }

        const models = [
            {
                brand_id: "Toyota",
                name: "Corolla",
            },
            {
                brand_id: "Honda",
                name: "Civic",
            },
            {
                brand_id: "Ford",
                name: "Focus",
            },
        ];

        // Buscar las marcas existentes y crear un mapa de nombres a IDs
        const brands = await CarBrand.find({}, "_id name");
        const brandMap = new Map(
            brands.map((brand) => [brand.name, brand._id])
        );

        if (!brandMap) {
            logger.debug(
                "No models have been registered as no marks have been found."
            );
            process.exit(0);
        }

        // Convertir los modelos usando los IDs de las marcas
        const modelsToInsert: ICarModelBase[] = models.reduce<ICarModelBase[]>(
            (acc, model) => {
                const brandId = brandMap.get(model.brand_id);

                if (brandId) {
                    acc.push({
                        brand_id: brandId,
                        name: model.name,
                    });
                }

                return acc;
            },

            []
        );

        await CarModel.insertMany(modelsToInsert);
        logger.debug("Models inserted correctly");
        process.exit(0);
    } catch (error) {
        logger.debug(`Error inserting brands`);
        logger.error(error);
        process.exit(1);
    }
};

seedCarModels();
