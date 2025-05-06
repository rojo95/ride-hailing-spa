import Vehicle from "../models/vehicle.model";

class VehicleService {
    static async getAllVehicles() {
        const users = await Vehicle.find({})
            .populate({
                path: "model_id",
                populate: { path: "brand_id" },
            })
            .populate("driver_id");

        return users;
    }
}

export default VehicleService;
