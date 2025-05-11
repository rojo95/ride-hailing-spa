import { Types } from "mongoose";
import Route, { IRouteBase } from "../models/route.model";

export default class RouteService {
    static async getLastRouteByVehicleId(_id: Types.ObjectId) {
        const route = await Route.findOne({ vehicle_id: _id }).sort({
            createdAt: -1,
        });

        return route;
    }

    static async create({
        from,
        to,
        status,
        vehicle_id,
        from_address,
        to_address,
        createdBy,
    }: IRouteBase) {
        const route = new Route({
            from,
            to,
            from_address,
            to_address,
            createdBy,
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
        updatedBy,
    }: {
        _id: Types.ObjectId;
        status: number;
        updatedBy: Types.ObjectId;
    }) {
        const updatedRoute = await Route.findByIdAndUpdate(
            _id,
            { status, updatedBy },
            { new: true }
        );

        return updatedRoute;
    }

    static async deleteById(_id: Types.ObjectId) {
        const deleted = await Route.findByIdAndDelete(_id);
        return deleted;
    }
}
