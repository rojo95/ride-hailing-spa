import Joi from "joi";
import { NextFunction, Request, Response } from "express";
import {
    ID_CARD_PATTERN,
    MOBILE_NUMBER,
    ONLY_TEXT_PATTERN,
} from "../constants/patterns";
import { isValidObjectId } from "mongoose";
import { STATUSES } from "../constants/vehicle";
import { ITEMS_FILTER } from "../constants/filters";

export const validateRegisterVehicleDriver = (
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
        email: Joi.string()
            .email({ tlds: { allow: false } })
            .required()
            .messages({
                "string.empty": "El correo no puede estar vacío",
                "string.email": "El correo electrónico no es válido",
                "any.required": "El correo es un campo obligatorio",
            }),
        phone: Joi.string().pattern(MOBILE_NUMBER).required().messages({
            "string.empty": "El teléfono no puede estar vacío",
            "string.pattern.base":
                "El número de teléfono debe contener entre 7 y 15 dígitos y puede iniciar con +",
            "any.required": "El teléfono es un campo obligatorio",
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
        plate: Joi.string().required().messages({
            "string.empty": "La placa no puede estar vacía",
            "any.required": "La placa es un campo obligatorio",
        }),
        model_id: Joi.any()
            .required()
            .custom((value, helpers) => {
                const filtered = isValidObjectId(value);
                return !filtered ? helpers.error("any.objectId") : value;
            })
            .messages({
                "any.objectId": "El modelo del vehículo no es un valor válido",
                "any.empty": "El modelo del vehículo no puede estar vacío",
                "any.required": "El modelo del vehículo es obligatorio",
            }),
        year: Joi.date().required().messages({
            "string.empty": "El año no puede estar vacío",
            "date.base": "El año del vehículo debe ser una fecha válida",
            "any.required": "Debes ingresar una año de vehículo",
        }),
        color: Joi.string().required().pattern(ONLY_TEXT_PATTERN).messages({
            "string.empty": "El color no puede estar vacío",
            "string.pattern.base": "El formato del color no es válido",
            "any.required": "El color es un campo obligatorio",
        }),
        capacity: Joi.number().required().min(2).max(9).messages({
            "number.base": "La capacidad debe ser un número",
            "number.min": "La capacidad debe ser al menos 2",
            "number.max": "La capacidad debe ser máximo 9",
            "any.required": "La capacidad es un campo obligatorio",
        }),
        picture: Joi.any()
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
                "any.empty": "La foto del auto no puede estar vacía",
                "any.required": "La foto del auto es obligatoria",
            }),
        status: Joi.number()
            .required()
            .valid(...Object.values(STATUSES))
            .messages({
                "number.base": "El estado del vehículo debe ser un número",
                "any.required": "El estado del vehículo es obligatorio",
                "any.only": `El estado del vehículo debe ser uno de los valores válidos`,
            }),
    });
    const { error } = schema.validate(req.body);

    if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
    }
    next();
};

export const validateVehicleIdParam = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const schema = Joi.object({
        id: Joi.any()
            .required()
            .custom((value, helpers) => {
                const filtered = isValidObjectId(value);
                return !filtered ? helpers.error("any.objectId") : value;
            })
            .messages({
                "any.invalid": "El ID del vehículo no es válido",
                "any.empty": "El ID no puede estar vacío",
                "any.required": "El ID del vehículo es obligatorio",
            }),
    });

    const { error } = schema.validate(req.params);

    if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
    }

    next();
};

export const validateVehiclePaginationParams = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const schema = Joi.object({
        page: Joi.number().integer().min(1).required().messages({
            "number.base": "El número de página debe ser un número",
            "number.integer": "La página debe ser un número entero",
            "number.min": "La página debe ser al menos 1",
            "any.required": "El parámetro de página es obligatorio",
        }),
        limit: Joi.number().integer().min(1).max(100).required().messages({
            "number.base": "El límite debe ser un número",
            "number.integer": "El límite debe ser un número entero",
            "number.min": "El límite debe ser al menos 1",
            "number.max": "El límite debe ser como máximo 100",
            "any.required": "El parámetro de límite es obligatorio",
        }),
        filter: Joi.number()
            .valid(...Object.values(ITEMS_FILTER))
            .messages({
                "number.base": "El filtro debe ser un número",
                "any.only": "El filtro debe ser uno de los valores válidos",
            }),
    });

    const { error } = schema.validate(req.params);

    if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
    }

    next();
};

export const validateSoftDeleteVehicle = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const schema = Joi.object({
        id: Joi.any()
            .required()
            .custom((value, helpers) => {
                const filtered = isValidObjectId(value);
                return !filtered ? helpers.error("any.objectId") : value;
            })
            .messages({
                "any.invalid": "El ID del vehículo no es válido",
                "any.empty": "El ID no puede estar vacío",
                "any.required": "El ID del vehículo es obligatorio",
            }),
    });

    const { error } = schema.validate(req.body); // Validamos el ID desde los parámetros

    if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
    }

    next();
};

export const validateUpdateVehicleDriver = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    if (!req.body) {
        res.status(400).json({ error: "No se ha recibido data" });
        return;
    }

    const schema = Joi.object({
        idCard: Joi.string().pattern(ID_CARD_PATTERN).messages({
            "string.pattern.base": "El formato de la cédula no es válido",
        }),
        name: Joi.string().pattern(ONLY_TEXT_PATTERN).messages({
            "string.pattern.base": "El nombre no es válido",
        }),
        lastname: Joi.string().pattern(ONLY_TEXT_PATTERN).messages({
            "string.pattern.base": "El apellido no es válido",
        }),
        licenseExpiry: Joi.date().messages({
            "date.base":
                "La fecha de expiración de licencia debe ser una fecha válida",
        }),
        email: Joi.string()
            .email({ tlds: { allow: false } })
            .messages({
                "string.email": "El correo electrónico no es válido",
            }),
        phone: Joi.string().pattern(MOBILE_NUMBER).messages({
            "string.pattern.base":
                "El número de teléfono debe contener entre 7 y 15 dígitos y puede iniciar con +",
        }),
        avatar: Joi.any()
            .optional()
            .custom((value, helpers) => {
                if (
                    value &&
                    typeof value === "object" &&
                    Object.keys(value).length === 0
                ) {
                    return helpers.error("any.empty");
                }
                return value;
            })
            .messages({
                "any.empty": "El avatar no puede estar vacío si se envía",
            }),
        plate: Joi.string().messages({
            "string.empty": "La placa no puede estar vacía",
        }),
        model_id: Joi.string()
            .custom((value, helpers) => {
                if (!isValidObjectId(value)) {
                    return helpers.error("any.objectId");
                }
                return value;
            })
            .messages({
                "any.objectId": "El modelo del vehículo no es un valor válido",
            }),
        year: Joi.date().messages({
            "date.base": "El año del vehículo debe ser una fecha válida",
        }),
        color: Joi.string().pattern(ONLY_TEXT_PATTERN).messages({
            "string.pattern.base": "El formato del color no es válido",
        }),
        capacity: Joi.number().min(2).max(9).messages({
            "number.base": "La capacidad debe ser un número",
            "number.min": "La capacidad debe ser al menos 2",
            "number.max": "La capacidad debe ser máximo 9",
        }),
        picture: Joi.any()
            .optional()
            .custom((value, helpers) => {
                if (
                    value &&
                    typeof value === "object" &&
                    Object.keys(value).length === 0
                ) {
                    return helpers.error("any.empty");
                }
                return value;
            })
            .messages({
                "any.empty":
                    "La foto del auto no puede estar vacía si se envía",
            }),
        status: Joi.number()
            .valid(...Object.values(STATUSES))
            .messages({
                "number.base": "El estado del vehículo debe ser un número",
                "any.only":
                    "El estado del vehículo debe ser uno de los valores válidos",
            }),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
    }

    next();
};

export const validateUpdateVehicleStatus = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const bodySchema = Joi.object({
        status: Joi.number()
            .valid(...Object.values(STATUSES))
            .required()
            .messages({
                "number.base": "El estado debe ser un número",
                "any.required": "El estado es obligatorio",
                "any.only": "El estado no es válido",
            }),
    });

    const { error: bodyError } = bodySchema.validate(req.body);
    if (bodyError) {
        res.status(400).json({ error: bodyError.details[0].message });
        return;
    }

    next();
};
