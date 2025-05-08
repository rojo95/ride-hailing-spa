import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/user.model";
import { jwtConfig } from "../config/jwt.config";

export default class AuthService {
    static async register(
        email: string,
        password: string,
        secretQuestion: string,
        secretAnswer: string
    ): Promise<IUser> {
        const u = await User.findOne({ email });
        if (u) throw Error("El usuario ya está registrado.");

        const hashedPassword = await bcrypt.hash(password, 10);
        const hashedAnswer = await bcrypt.hash(secretAnswer, 10);
        const user = new User({
            email,
            password: hashedPassword,
            secretQuestion,
            secretAnswer: hashedAnswer,
        });
        await user.save();
        return user;
    }

    static async login(
        email: string,
        password: string
    ): Promise<{ token: string; user: IUser }> {
        const user = await User.findOne({ email });
        if (!user) throw new Error("Usuario no encontrado.");

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error("Contraseña incorrecta.");

        const { secret, expiresIn } = jwtConfig;

        if (!secret || !expiresIn) {
            throw new Error("JWT_SECRET o JWT_EXPIRES_IN no están definidos.");
        }

        const token = jwt.sign({ id: user._id }, secret, {
            expiresIn: expiresIn,
        });

        return { token, user };
    }

    static async resetPassword(
        email: string,
        secretAnswer: string,
        newPassword: string
    ) {
        const user = await User.findOne({ email });
        if (!user) throw new Error("No se ha encontrado usuario.");

        const isMatch = await bcrypt.compare(secretAnswer, user.secretAnswer);
        if (!isMatch) throw new Error("Respuesta secreta incorrecta.");

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        return user;
    }
}
