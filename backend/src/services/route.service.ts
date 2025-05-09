import { Types } from "mongoose";
import Route, { IRouteBase } from "../models/route.model";

export default class RouteService {
    static async getLastRouteByVehicleId(_id: Types.ObjectId) {
        const route = await Route.findOne({ vehicle_id: _id }).sort({
            createdAt: -1,
        });

        return route;
    }

    static async create({ from, to, status, vehicle_id }: IRouteBase) {
        // const existingRoute = await Route.findOne({ vehicle_id });

        const route = new Route({
            from,
            to,
            status,
            vehicle_id,
        });

        await route.save();

        return route.toObject();
    }

    static async getById(_id: Types.ObjectId) {
        const route = await Route.findOne({ _id });

        return route;
    }

    static async updateStatus({
        _id,
        status,
    }: {
        _id: Types.ObjectId;
        status: number;
    }) {
        const updatedRoute = await Route.findByIdAndUpdate(
            _id,
            { status },
            { new: true }
        );

        return updatedRoute;
    }
}
