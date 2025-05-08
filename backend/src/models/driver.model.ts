import { model, Schema, Types } from "mongoose";

// Interfaz TypeScript
export interface IDriver extends Document {
    _id: Types.ObjectId;
    idCard: string;
    name: string;
    lastname: string;
    avatar: string;
    licenseExpiry: Date;
}

// Documento Mongoose con tipado
interface IDriverDocument extends IDriver, Document {}

// Esquema de Mongoose
const DriverSchema = new Schema<IDriverDocument>({
    idCard: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    avatar: { type: String, required: true },
    licenseExpiry: { type: Date, required: true },
});

// Exportar el modelo
const Driver = model<IDriverDocument>("Driver", DriverSchema);

export default Driver;
