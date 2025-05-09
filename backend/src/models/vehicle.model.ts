import { Schema, Document, model, Types } from "mongoose";
import CarModel from "./carModel.model";
import Driver from "./driver.model";
import { IRoute } from "./route.model";

export interface IVehicle extends Document {
    _id: Types.ObjectId;
    plate: string;
    model_id: Types.ObjectId;
    year: Date;
    color: string;
    capacity: number;
    driver_id: Types.ObjectId;
    status_id: boolean;
    picture: string;
    routes?: IRoute[];
}

const vehicleSchema = new Schema<IVehicle>(
    {
        plate: { type: String, required: true, unique: true },
        model_id: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: CarModel,
        },
        year: { type: Date, required: true, default: new Date().getFullYear() },
        color: { type: String, required: true },
        capacity: { type: Number, required: true },
        driver_id: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: Driver,
        },
        status_id: { type: Boolean, default: true },
        picture: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);

const Vehicle = model<IVehicle>("Vehicle", vehicleSchema);

export default Vehicle;
