import type { CarBrand } from "./carBrand";

export interface CarModel {
    _id: string;
    brand_id: CarBrand;
    name: string;
}
