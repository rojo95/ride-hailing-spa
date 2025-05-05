import { Request, Response } from "express";
import AuthService from "../services/auth.service";
import {
    LoginRequest,
    RegisterRequest,
    ResetPasswordRequest,
} from "../types/auth.types";
import logger from "../utils/logger";
import UserService from "../services/users.service";

class AuthController {
    static async register(
        req: Request<{}, {}, RegisterRequest>,
        res: Response
    ) {
        try {
            const { email, password, secretQuestion, secretAnswer } = req.body;
            const user = await AuthService.register(
                email,
                password,
                secretQuestion,
                secretAnswer
            );
            res.status(201).json(user);
        } catch (error) {
            logger.error("Error in user registration: ", error);

            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(400).json({
                    error: "Ha ocurrido un error desconocido al registrar el usuario.",
                    fullError: error,
                });
            }
        }
    }

    static async login(req: Request<{}, {}, LoginRequest>, res: Response) {
        try {
            const { email, password } = req.body;
            const { token, user } = await AuthService.login(email, password);
            res.status(200).json({ token, user });
        } catch (error) {
            logger.error("User login error: ", error);

            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(400).json({
                    error: "Ha ocurrido un error desconocido al intentar iniciar sesión",
                    fullError: error,
                });
            }
        }
    }

    static async secretQuestion(
        req: Request<{}, {}, ResetPasswordRequest>,
        res: Response
    ) {
        try {
            const { email } = req.body;

            const user = await UserService.getUserByField("email", email, true);

            res.status(200).json({ question: user.secretQuestion });
        } catch (error) {
            logger.error("Error trying to obtain the secret question: ", error);

            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(400).json({
                    error: "Ha ocurrido un error desconocido al intentar consultar la pregunta secreta",
                    fullError: error,
                });
            }
        }
    }

    static async resetPassword(
        req: Request<{}, {}, ResetPasswordRequest>,
        res: Response
    ) {
        try {
            const { email, secretAnswer, newPassword } = req.body;
            const user = await AuthService.resetPassword(
                email,
                secretAnswer,
                newPassword
            );
            res.status(200).json(user);
        } catch (error) {
            logger.error("Error trying to recover password: ", error);

            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(400).json({
                    error: "Ha ocurrido un error desconocido al intentar cambiar la contraseña.",
                    fullError: error,
                });
            }
        }
    }
}

export default AuthController;
