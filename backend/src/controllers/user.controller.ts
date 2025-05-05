import { Request, Response } from "express";
import logger from "../utils/logger";
import UserService from "../services/users.service";
import { isDecodedUserToken } from "../utils/typeGuards";
import { handleErrorMessage } from "../utils/handleErrorMessage";

class UserController {
    static async myself(req: Request, res: Response): Promise<void> {
        const { user: userLoged } = req;

        try {
            if (!isDecodedUserToken(userLoged)) {
                res.status(401).json({ error: "Sesión no válida." });
                return;
            }

            const user = await UserService.getUserByField(
                "_id",
                userLoged?.id,
                false
            );

            res.status(200).json(user);
        } catch (error) {
            logger.debug(`Error getting user data: ${req.originalUrl}`);
            logger.error(error);

            res.status(400).json({
                error: handleErrorMessage({
                    error,
                    defaultMessage:
                        "Ha ocurrido un error desconocido al obtener los datos personales",
                }),
                fullError: error,
            });
        }
    }

    static async all(req: Request, res: Response): Promise<void> {
        const { user: userLoged } = req;

        try {
            if (!isDecodedUserToken(userLoged)) {
                res.status(401).json({ error: "Token inválido" });
                return;
            }

            const user = await UserService.getUserByField(
                "_id",
                userLoged.id,
                false
            );

            if (user.role !== "admin") {
                const clientIp = req.ip || req.socket.remoteAddress;
                const requestUrl = req.originalUrl;
                const host = req.get("host") || req.headers.host; // o req.headers.host

                logger.warn(
                    `Unauthorized user request - IP: ${clientIp}, Host: ${host}, URL: ${requestUrl}`
                );

                res.status(403).json({ error: "No autorizado" });
                return;
            }

            const users = await UserService.getAllUsers();
            res.status(200).json(users);
        } catch (error) {
            logger.debug(`Error getting users: ${req.originalUrl}`);
            logger.error(error);

            res.status(500).json({
                error: handleErrorMessage({
                    error,
                    defaultMessage: "Error inesperado al obtener usuarios.",
                }),
                fullError: error,
            });
        }
    }
}

export default UserController;
