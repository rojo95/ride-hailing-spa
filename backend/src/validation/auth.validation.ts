import Joi from "joi";
import { Request, Response, NextFunction } from "express";

// Validación para el registro de usuario
export const validateRegister = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    if (!req.body) {
        res.status(400).json({ error: "No se ha recibido data." });
        return;
    }
    const schema = Joi.object({
        email: Joi.string().email().required().messages({
            "string.email":
                "El correo electrónico que ingresaste no es válido.",
            "any.required": "El correo electrónico es un campo obligatorio.",
        }),
        password: Joi.string().min(6).required().messages({
            "string.min": "Tu contraseña debe tener al menos 6 caracteres.",
            "any.required": "La contraseña es obligatoria.",
        }),
        secretQuestion: Joi.string().required().messages({
            "any.required": "La pregunta secreta es requerida.",
        }),
        secretAnswer: Joi.string().required().messages({
            "any.required": "La respuesta secreta es obligatoria",
        }),
    });

    const { error } = schema.validate(req.body);

    if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
    }
    next();
};

// Validación para el login de usuario
export const validateLogin = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    if (!req.body) {
        res.status(400).json({ error: "No se ha recibido data." });
        return;
    }
    const schema = Joi.object({
        email: Joi.string().email().required().messages({
            "string.email": "Por favor, ingrese un correo electrónico válido.",
            "string.base":
                "El correo electrónico debe ser una cadena de texto.",
            "any.required": "El correo electrónico es obligatorio.",
        }),
        password: Joi.string().min(6).required().messages({
            "string.min": "La contraseña debe tener al menos 6 caracteres.",
            "string.base": "La contraseña debe ser una cadena de texto.",
            "any.required": "La contraseña es obligatoria.",
        }),
    });

    const { error } = schema.validate(req.body);

    if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
    }
    next();
};

// Validación para consulta de pregunta secreta
export const validateSecretQuestionRequest = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    if (!req.body) {
        res.status(400).json({ error: "No se ha recibido data." });
        return;
    }

    const schema = Joi.object({
        email: Joi.string().email().required().messages({
            "string.email":
                "El correo electrónico que ingresaste no es válido.",
            "any.required": "El correo electrónico es obligatorio.",
        }),
    });

    const { error } = schema.validate(req.body);

    if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
    }

    next();
};

// Validación para la recuperación de contraseña
export const validateResetPassword = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    if (!req.body) {
        res.status(400).json({ error: "No se ha recibido data." });
        return;
    }
    const schema = Joi.object({
        email: Joi.string().email().required().messages({
            "string.email":
                "El correo electrónico que ingresaste no es válido.",
            "any.required": "El correo electrónico es obligatorio.",
        }),
        secretAnswer: Joi.string().required().messages({
            "any.required": "La respuesta secreta es requerida.",
        }),
        newPassword: Joi.string().min(6).required().messages({
            "string.min":
                "La nueva contraseña debe tener al menos 6 caracteres.",
            "any.required": "La nueva contraseña es obligatoria.",
        }),
    });

    const { error } = schema.validate(req.body);

    if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
    }
    next();
};
