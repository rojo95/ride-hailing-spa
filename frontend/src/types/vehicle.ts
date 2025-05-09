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
    status_id: number;
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
}
