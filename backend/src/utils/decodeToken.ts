import { Request } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { jwtConfig } from "../config/jwt.config";
import { isValidObjectId, Types } from "mongoose";

export interface DecodedToken {
    id: Types.ObjectId;
}

export function decodeTokenFromRequest(req: Request): DecodedToken {
    const authHeader =
        req.header?.("Authorization") || req.headers?.authorization;

    if (typeof authHeader !== "string") {
        throw new Error("Token no proporcionado");
    }

    const token = authHeader.replace("Bearer ", "").trim();

    if (!token) {
        throw new Error("Token no válido");
    }

    const decoded = jwt.verify(token, jwtConfig.secret);

    if (
        typeof decoded !== "object" ||
        decoded === null ||
        !("id" in decoded) ||
        typeof decoded.id !== "string"
    ) {
        throw new Error("Token no válido");
    }

    const { id, ...rest } = decoded;

    if (!isValidObjectId(id)) throw Error("ID no válido");

    return {
        id: new Types.ObjectId(id),
        ...rest,
    };
}
