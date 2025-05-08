import CarBrand from "../models/carBrand.model";
import CarModel from "../models/carModel.model";

export default class CarBrandService {
    static async getAllCarBrands() {
        const brands = await CarBrand.find({});

        const results = await Promise.all(
            brands.map(async (brand) => {
                const models = await CarModel.find({ brand_id: brand._id });
                return {
                    ...brand.toObject(),
                    models,
                };
            })
        );

        return results;
    }
}
