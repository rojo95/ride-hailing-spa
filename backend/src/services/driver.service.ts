import { FilterQuery, Types } from "mongoose";
import Driver, { IDriver } from "../models/driver.model";
import { RegisterDriverService } from "../types/driver";
import logger from "../utils/logger";

export default class DriverService {
    static async create({
        idCard,
        name,
        lastname,
        licenseExpiry,
        avatar,
        createdBy,
        email,
        phone,
    }: RegisterDriverService): Promise<IDriver> {
        const d = await Driver.findOne({ idCard });
        if (d) throw Error("El conductor ya está registrado.");

        const driver = new Driver({
            idCard,
            name,
            lastname,
            licenseExpiry,
            avatar,
            email,
            phone,
            createdBy,
        });
        await driver.save();

        return driver.toObject();
    }

    static async findManyByAnyField(
        fields: Partial<Record<keyof IDriver, any>>
    ): Promise<IDriver[]> {
        const orConditions = Object.entries(fields).map(([key, value]) => ({
            [key]: value,
        }));
        const drivers = await Driver.find({ $or: orConditions });
        return drivers.map((driver) => driver.toObject());
    }

    static async delete(_id: Types.ObjectId): Promise<boolean> {
        const result = await Driver.deleteOne({ _id });

        return result.deletedCount === 1;
    }
}
