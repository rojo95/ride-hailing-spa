export const STATUSES = {
    MAINTENANCE: 0,
    AVAILABLE: 1,
    IN_SERVICE: 2,
} as const;

export const carStatuses = Object.entries(STATUSES).map(([key, id]) => ({
    id,
    description:
        key === "MAINTENANCE"
            ? "Mantenimiento"
            : key === "AVAILABLE"
            ? "Disponible"
            : "En servicio",
}));
