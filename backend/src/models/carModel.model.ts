import { HydratedDocument, model, Schema, Types } from "mongoose";
import CarBrand from "./carBrand.model";

export interface ICarModelBase {
    brand_id: Types.ObjectId;
    name: string;
}

export interface ICarModel
    extends ICarModelBase,
        HydratedDocument<ICarModelBase> {}

const carModelScheme = new Schema<ICarModel>(
    {
        brand_id: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: CarBrand,
        },
        name: { type: String, required: true, unique: true },
    },
    {
        timestamps: true,
    }
);

const CarModel = model<ICarModel>("Car_Model", carModelScheme);

export default CarModel;
