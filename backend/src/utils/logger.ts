import pino from "pino";
import pretty from "pino-pretty";

// Configuración de Pino con pino-pretty
const logger = pino(
    {
        level: process.env.LOG_LEVEL || "info",
    },
    pretty({
        colorize: true, // Habilita colores en los logs
        translateTime: "SYS:standard", // Configura el timestamp al formato estándar
        ignore: "pid,hostname", // Ignora pid y hostname
    })
);

export default logger;
