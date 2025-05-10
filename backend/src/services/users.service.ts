import mongoose from "mongoose";
import User, { IUser } from "../models/user.model";

const basicUserProjection = { email: 1, role: 1 };
const userWithSecretProjection = { email: 1, role: 1, secretQuestion: 1 };

export default class UserService {
    static async getUserByField(
        field: "email" | "_id",
        value: string,
        includeSecret = false
    ): Promise<IUser> {
        if (field === "_id" && !mongoose.Types.ObjectId.isValid(value)) {
            throw new Error("ID inválido");
        }

        const query = { [field]: value };

        const projection = includeSecret
            ? userWithSecretProjection
            : basicUserProjection;

        const user = await User.findOne(query, projection);
        if (!user) throw new Error("Usuario no encontrado");

        return user;
    }

    static async getAllUsers() {
        const users = await User.find(
            {},
            {
                email: 1,
                role: 1,
            }
        );

        return users;
    }
}
