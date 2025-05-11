export const ITEMS_FILTER = {
    YEAR: { id: 1, description: "Año" },
    COLOR: { id: 2, description: "Color" },
    DRIVER: { id: 3, description: "Conductor" },
    BRAND: { id: 4, description: "Marca" },
    NEW: { id: 5, description: "Más Nuevo" },
    MODEL: { id: 6, description: "Modelo" },
    PLATE: { id: 7, description: "Placa" },
} as const;

export const ItemsFilter = Object.entries(ITEMS_FILTER)
    .map(([key, value]) => ({ key, ...value }))
    .sort((a, b) => a.description.localeCompare(b.description));
