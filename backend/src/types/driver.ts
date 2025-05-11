import { IDriver } from "../models/driver.model";

export interface RegisterDriverRequest
    extends Omit<RegisterDriverService, "createdBy"> {}

export interface RegisterDriverService
    extends Omit<IDriver, "updatedBy" | "_id"> {}

export interface UpdateDriverRequest
    extends Omit<RegisterDriverRequest, "avatar"> {
    avatar?: string;
}

export interface UpdateDriverService
    extends Omit<IDriver, "avatar" | "createdBy" | "_id"> {
    avatar?: string;
}
