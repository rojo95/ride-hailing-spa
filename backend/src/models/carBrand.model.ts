import { HydratedDocument, model, Schema } from "mongoose";

export interface ICarBrandBase {
    name: string;
}

export interface ICarBrand
    extends ICarBrandBase,
        HydratedDocument<ICarBrandBase> {}

const carModelScheme = new Schema<ICarBrand>(
    {
        name: { type: String, required: true, unique: true },
    },
    {
        timestamps: true,
    }
);

const CarBrand = model<ICarBrand>("car_brand", carModelScheme);

export default CarBrand;
