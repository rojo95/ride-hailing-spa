import { Document, HydratedDocument, model, Schema, Types } from "mongoose";
import Vehicle from "./vehicle.model";
import User from "./user.model";

interface Location {
    lat: number;
    lon: number;
}

export interface IRouteBase {
    from: Location;
    to: Location;
    from_address: string;
    to_address: string;
    status: Number;
    vehicle_id: Types.ObjectId;
    createdBy: Types.ObjectId;
    updatedBy?: Types.ObjectId;
}

export interface IRoute extends IRouteBase, HydratedDocument<IRouteBase> {
    _id: Types.ObjectId;
}

export interface IRouteUpdateStatus {
    _id: Types.ObjectId;
    status: number;
}

const routeScheme = new Schema<IRoute>(
    {
        from: { type: { lat: Number, lon: Number }, required: true },
        to: { type: { lat: Number, lon: Number }, required: true },
        from_address: { type: String, required: true },
        to_address: { type: String, required: true },
        status: { type: Number, required: true, default: 1 },
        vehicle_id: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: Vehicle,
        },
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
    },
    {
        timestamps: true,
    }
);

const Route = model<IRoute>("Route", routeScheme);

export default Route;
