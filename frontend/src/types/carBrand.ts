import type { CarModel } from "./carModel";

interface CarBrandBase {
    name: string;
}

export interface CarBrand extends CarBrandBase {
    _id: string;
}

export interface CarBrandResponse extends CarBrandBase {
    _id: string;
    models: CarModel[];
}
