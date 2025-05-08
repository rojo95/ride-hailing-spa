// Campos comunes entre ambos
interface DriverBase {
    idCard: string;
    name: string;
    lastname: string;
    rating: number | string; // Puede ser string en el formulario, number en la respuesta
    licenseExpiry: Date | string; // Puede ser string en el formulario, Date en el servidor
}

// Driver que viene del servidor (readonly, tipado estricto)
export interface Driver extends DriverBase {
    _id: string;
    avatar: string;
}

// Driver usado en el formulario (editable, incluye File)
export interface DriverForm
    extends Omit<DriverBase, "rating" /* | "licenseExpiry" */> {
    avatar: File | null;
}
