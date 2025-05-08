const MIN_LENGTH = 6;
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
const ID_CARD_PATTERN = /^[EV]-\d{8}$/;
export const ONLY_TEXT_PATTERN = /^[a-zA-Z-áéíóúÁÉÍÓÚñÑ\s]+$/;
const ONLY_NUMBER_PATTERN = /^[0-9]+$/;

export type RuleStringValue = string | null;

export const password = [
    (v: RuleStringValue) =>
        (v && v.length >= MIN_LENGTH) || `Mínimo ${MIN_LENGTH} caracteres.`,
    (v: RuleStringValue) =>
        !v ||
        PASSWORD_PATTERN.test(v) ||
        "La contraseña debe contener al menos una letra mayúscula, una letra minúscula y un número.",
] as const;

export const email = [
    (v: RuleStringValue) => inputRequired(v),
    (v: RuleStringValue) => !v || /.+@.+\..+/.test(v) || "Email no válido.",
] as const;

export const inputRequired = (v: RuleStringValue) => !!v || "Campo requerido.";

export const idCard = (v: RuleStringValue) =>
    !v ||
    ID_CARD_PATTERN.test(v) ||
    "Formato no valido para la cédula. (ej: V-00000000 o E-00000000)";

export const onlyText = (v: RuleStringValue) =>
    !v || ONLY_TEXT_PATTERN.test(v) || "El campo sólo acepta texto";

export const onlyNumber = (v: RuleStringValue) =>
    !v || ONLY_NUMBER_PATTERN.test(v) || "El campo sólo acepta números";

export const minValue = (v: RuleStringValue, min: number) =>
    !v || parseFloat(v) >= min || "El campo no debe ser menor a " + min;

export const maxValue = (v: RuleStringValue, max: number) =>
    !v || parseFloat(v) <= max || "El campo no debe ser mayor a " + max;
