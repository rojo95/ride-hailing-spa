import Joi from "joi";
import { NextFunction, Request, Response } from "express";
import { ID_CARD_PATTERN, ONLY_TEXT_PATTERN } from "../constants/patterns";

export const validateRegisterDriver = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    if (!req.body) {
        res.status(400).json({ error: "No se ha recibido data" });
        return;
    }

    const schema = Joi.object({
        idCard: Joi.string().required().pattern(ID_CARD_PATTERN).messages({
            "string.empty": "La cédula no puede estar vacía",
            "string.pattern.base": "El formato de la cédula no es válido",
            "any.required": "La cédula es un campo obligatorio",
        }),
        name: Joi.string().required().pattern(ONLY_TEXT_PATTERN).messages({
            "string.empty": "El nombre no puede estar vacío",
            "string.pattern.base": "El nombre no es válido",
            "any.required": "El nombre es un campo obligatorio",
        }),
        lastname: Joi.string().required().pattern(ONLY_TEXT_PATTERN).messages({
            "string.empty": "El apellido no puede estar vacío",
            "string.pattern.base": "El apellido no es válido",
            "any.required": "El apellido es un campo obligatorio",
        }),
        licenseExpiry: Joi.date().required().messages({
            "string.empty": "La fecha no puede estar vacía",
            "date.base":
                "La fecha de expiración de licencia debe ser una fecha válida",
            "any.required":
                "Debes ingresar una fecha de expiración de licencia",
        }),
        avatar: Joi.any()
            .required()
            .custom((value, helpers) => {
                // In case avatar is an uploaded file object (e.g. from multer), check it is not empty
                if (
                    !value ||
                    (typeof value === "object" &&
                        Object.keys(value).length === 0)
                ) {
                    return helpers.error("any.empty");
                }
                return value;
            })
            .messages({
                "any.empty": "El avatar no puede estar vacío",
                "any.required": "El avatar del conductor es obligatorio",
            }),
    });
    const { error } = schema.validate(req.body);

    if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
    }
    next();
};
