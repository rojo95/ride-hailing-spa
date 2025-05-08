import Joi from "joi";
import { NextFunction, Request, Response } from "express";
import { isValidObjectId } from "mongoose";

export const validateCreateRoute = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    if (!req.body) {
        res.status(400).json({ error: "No se ha recibido data" });
        return;
    }

    const locationSchema = Joi.object({
        lat: Joi.number().required().messages({
            "number.base": "La latitud debe ser un número",
            "any.required": "La latitud es obligatoria",
        }),
        lon: Joi.number().required().messages({
            "number.base": "La longitud debe ser un número",
            "any.required": "La longitud es obligatoria",
        }),
    });

    const schema = Joi.object({
        from: locationSchema.required().messages({
            "any.required": "El origen es obligatorio",
        }),
        to: locationSchema.required().messages({
            "any.required": "El destino es obligatorio",
        }),
        status: Joi.number().required().valid(0, 1, 2, 3).messages({
            "number.base": "El estado debe ser un número",
            "any.required": "El estado es obligatorio",
            "any.only":
                "El estado debe ser uno de los valores válidos: 0, 1, 2 o 3",
        }),
        vehicle_id: Joi.any()
            .required()
            .custom((value, helpers) => {
                if (!isValidObjectId(value)) {
                    return helpers.error("any.invalid");
                }
                return value;
            })
            .messages({
                "any.invalid": "El ID del vehículo no es válido",
                "any.required": "El ID del vehículo es obligatorio",
            }),
    });

    const { error } = schema.validate(req.body);

    if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
    }

    next();
};
