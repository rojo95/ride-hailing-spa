import { Document, model, Schema } from "mongoose";

interface Location {
    lar: number;
    lon: number;
}

export interface IRoute extends Document {
    from: Location;
    to: Location;
    status: Number;
}

const routeScheme = new Schema<IRoute>(
    {
        from: { type: Location, required: true },
        to: { type: Location, required: true },
        status: { type: Number, required: true, default: 1 },
    },
    {
        timestamps: true,
    }
);

const Route = model<IRoute>("Route", routeScheme);

export default Route;
