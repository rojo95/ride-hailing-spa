import { Types } from "mongoose";

export interface RegisterVehicleRequest {
    plate: string;
    model_id: Types.ObjectId;
    year: Date;
    color: string;
    capacity: number;
    picture: string;
    driver_id: Types.ObjectId;
    status: number;
    createdBy: Types.ObjectId;
}
