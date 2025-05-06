import type { CarModel } from "./carModel";
import type { Driver } from "./driver";

export interface Vehicle {
    _id: string;
    plate: string;
    model_id: CarModel;
    year: string;
    color: string;
    capacity: number;
    driver_id: Driver;
    status_id: number;
}
