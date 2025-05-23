import { Schema, model, Types } from "mongoose";
import mongooseDelete, { SoftDeleteDocument } from "mongoose-delete";
import CarModel from "./carModel.model";
import Driver from "./driver.model";
import { IRoute } from "./route.model";
import User from "./user.model";

export interface IVehicleBase {
    plate: string;
    model_id: Types.ObjectId;
    year: Date;
    color: string;
    capacity: number;
    driver_id: Types.ObjectId;
    status: number;
    picture: string;
    routes?: IRoute[];
    createdBy: Types.ObjectId;
    updatedBy?: Types.ObjectId;
}
export interface IVehicle extends SoftDeleteDocument, IVehicleBase {
    _id: Types.ObjectId;
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
        status: { type: Number, default: 1 },
        picture: { type: String, required: true },
        createdBy: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: User,
        },
        updatedBy: {
            type: Schema.Types.ObjectId,
            required: false,
            ref: User,
        },
        deletedBy: { type: Types.ObjectId, ref: "User", default: null },
    },
    {
        timestamps: true,
    }
);

vehicleSchema.index({ createdAt: 1 });

vehicleSchema.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: "all",
});

const Vehicle = model<IVehicle>("Vehicle", vehicleSchema);

export default Vehicle;
