import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { jwtConfig } from "../config/jwt.config";
import logger from "../utils/logger";

const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        const clientIp = req.ip || req.socket.remoteAddress;
        const requestUrl = req.originalUrl;
        const host = req.get("host") || req.headers.host; // o req.headers.host

        logger.warn(
            `Access denied - IP: ${clientIp}, Host: ${host}, URL: ${requestUrl}`
        );

        res.status(401).json({ error: "Acceso denegado" });
        return;
    }

    try {
        const decoded = jwt.verify(token, jwtConfig.secret);
        req.user = decoded;
        next();
    } catch (error) {
        logger.warn("Invalid token");
        res.status(400).json({ error: "Token no válido" });
    }
};

export default authMiddleware;
