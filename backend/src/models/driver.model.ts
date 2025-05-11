import { model, Schema, Types } from "mongoose";
import User from "./user.model";
export interface IDriver {
    _id: Types.ObjectId;
    idCard: string;
    name: string;
    lastname: string;
    avatar: string;
    licenseExpiry: Date;
    email: string;
    phone: string;
    createdBy: Types.ObjectId;
    updatedBy?: Types.ObjectId;
}

// Documento Mongoose con tipado
interface IDriverDocument extends IDriver, Document {}

// Esquema de Mongoose
const DriverSchema = new Schema<IDriverDocument>(
    {
        idCard: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        lastname: { type: String, required: true },
        avatar: { type: String, required: true },
        licenseExpiry: { type: Date, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        createdBy: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: User,
        },
        updatedBy: {
            type: Schema.Types.ObjectId,
            required: false,
            ref: User,
        },
    },
    {
        timestamps: true,
    }
);

// Exportar el modelo
const Driver = model<IDriverDocument>("Driver", DriverSchema);

export default Driver;
