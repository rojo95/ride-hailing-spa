import dotenv from "dotenv";
import { SignOptions } from "jsonwebtoken";

dotenv.config();

function isValidExpiresIn(value: unknown): value is SignOptions["expiresIn"] {
    if (typeof value === "number") return true;
    if (typeof value === "string") {
        return /^\d+(ms|s|m|h|d|w|y)$/.test(value);
    }
    return false;
}

const rawExpiresIn = process.env.JWT_EXPIRES_IN ?? "1d";

export const jwtConfig: {
    secret: string;
    expiresIn: SignOptions["expiresIn"];
} = {
    secret: process.env.JWT_SECRET ?? "clave-secreta",
    expiresIn: isValidExpiresIn(rawExpiresIn) ? rawExpiresIn : "1d",
};
