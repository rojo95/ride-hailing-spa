import { Types } from "mongoose";
import Driver, { IDriver } from "../models/driver.model";

export default class DriverService {
    static async create({
        idCard,
        name,
        lastname,
        licenseExpiry,
        avatar,
        createdBy,
    }: {
        idCard: string;
        name: string;
        lastname: string;
        licenseExpiry: Date;
        avatar: string;
        createdBy: Types.ObjectId;
    }): Promise<IDriver> {
        const d = await Driver.findOne({ idCard });
        if (d) throw Error("El conductor ya está registrado.");

        const driver = new Driver({
            idCard,
            name,
            lastname,
            licenseExpiry,
            avatar,
            createdBy,
        });
        await driver.save();

        return driver.toObject();
    }

    static async delete(_id: Types.ObjectId): Promise<boolean> {
        const result = await Driver.deleteOne({ _id });

        return result.deletedCount === 1;
    }
}
