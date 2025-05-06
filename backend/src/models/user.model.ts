import { Schema, Document, model } from "mongoose";

export interface IUser extends Document {
    email: string;
    password: string;
    role: string;
    secretQuestion: string;
    secretAnswer: string;
}

const userSchema = new Schema<IUser>(
    {
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, default: "user" },
        secretQuestion: { type: String, required: true },
        secretAnswer: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);

const User = model<IUser>("User", userSchema);

export default User;
