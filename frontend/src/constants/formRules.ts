const MIN_LENGTH = 6;
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

type RuleValue = string | null;

export const password = [
    (v: RuleValue) =>
        (v && v.length >= MIN_LENGTH) || `Mínimo ${MIN_LENGTH} caracteres.`,
    (v: RuleValue) =>
        !v ||
        PASSWORD_PATTERN.test(v) ||
        "La contraseña debe contener al menos una letra mayúscula, una letra minúscula y un número.",
] as const;

export const email = [
    (v: RuleValue) => inputRequired(v),
    (v: RuleValue) => !v || /.+@.+\..+/.test(v) || "Email no válido.",
] as const;

export const inputRequired = (v: RuleValue) => !!v || "Campo requerido.";
