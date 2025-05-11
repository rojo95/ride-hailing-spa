import { IDriver } from "../models/driver.model";

export interface RegisterDriverRequest
    extends Omit<RegisterDriverService, "createdBy"> {}

export interface RegisterDriverService
    extends Omit<IDriver, "updatedBy" | "_id"> {}
