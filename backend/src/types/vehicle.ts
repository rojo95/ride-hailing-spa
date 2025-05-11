import { IVehicle, IVehicleBase } from "../models/vehicle.model";

export interface RegisterVehicleRequest
    extends Omit<IVehicleBase, "_id" | "routes" | "updatedBy"> {}

export interface UpdateVehicleRequest
    extends Omit<RegisterVehicleRequest, "picture"> {
    picture?: string;
}

export interface UpdateVehicleService
    extends Omit<IVehicleBase, "picture" | "createdBy" | "_id" | "driver_id"> {
    picture?: string;
}
