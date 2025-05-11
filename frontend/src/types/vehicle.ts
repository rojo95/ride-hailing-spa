import type { CarModel } from "./carModel";
import type { Driver } from "./driver";
import type { Route } from "./route";

export interface Vehicle {
    _id: string;
    plate: string;
    model_id: CarModel;
    year: string;
    color: string;
    capacity: number;
    driver_id: Driver;
    status: number;
    picture: string;
    lastRoute?: Route;
    routes?: Route[];
}

export interface VehicleForm {
    plate: string;
    brand_id: string | null;
    model_id: string | null;
    year: number | null;
    color: string;
    capacity: number | null;
    picture: File | null;
    status: number | null;
}

export type UpdateVehicleForm = Omit<VehicleForm, "picture"> & {
    picture?: File | null;
};

export interface VehiclesResponse {
    data: Vehicle[];
    pagination: {
        limit: number;
        page: number;
        total: number;
        totalPages: number;
    };
}
