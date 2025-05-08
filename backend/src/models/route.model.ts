import { Document, HydratedDocument, model, Schema, Types } from "mongoose";
import Vehicle from "./vehicle.model";

interface Location {
    lat: number;
    lon: number;
}

export interface IRouteBase {
    from: Location;
    to: Location;
    status: Number;
    vehicle_id: Types.ObjectId;
}

export interface IRoute extends IRouteBase, HydratedDocument<IRouteBase> {
    _id: Types.ObjectId;
}

const routeScheme = new Schema<IRoute>(
    {
        from: { type: { lat: Number, lon: Number }, required: true },
        to: { type: { lat: Number, lon: Number }, required: true },
        status: { type: Number, required: true, default: 1 },
        vehicle_id: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: Vehicle,
        },
    },
    {
        timestamps: true,
    }
);

const Route = model<IRoute>("Route", routeScheme);

export default Route;
