// Campos comunes entre ambos
interface DriverBase {
    idCard: string;
    name: string;
    lastname: string;
    licenseExpiry: Date | string;
    email: string;
    phone: string;
}

export interface Driver extends DriverBase {
    _id: string;
    avatar: string;
    createdAt: string;
}

export interface DriverForm extends DriverBase {
    avatar: File | null;
}
