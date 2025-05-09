import type { Location } from "./location";

export type RouteBase = {
    from: Location;
    to: Location;
    from_address: string;
    to_address: string;
    status: number;
    vehicle_id: string;
};

export type Route = RouteBase & {
    _id: string;
};
