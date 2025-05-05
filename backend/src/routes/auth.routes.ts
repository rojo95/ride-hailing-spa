import { Router } from "express";
import AuthController from "../controllers/auth.controller";
import {
    validateRegister,
    validateLogin,
    validateResetPassword,
    validateSecretQuestionRequest,
} from "../validation/auth.validation";

const router = Router();

router.post("/", validateLogin, AuthController.login);
router.post("/register", validateRegister, AuthController.register);
router.post(
    "/secret-question",
    validateSecretQuestionRequest,
    AuthController.secretQuestion
);
router.post(
    "/reset-password",
    validateResetPassword,
    AuthController.resetPassword
);

export default router;
