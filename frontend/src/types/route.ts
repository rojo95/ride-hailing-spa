import type { Location } from "./location";

export type RouteBase = {
    from: Location;
    to: Location;
    status: number;
    vehicle_id: string;
};

export type Route = RouteBase & {
    _id: string;
};
