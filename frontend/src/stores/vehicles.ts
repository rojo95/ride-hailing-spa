import { defineStore } from "pinia";
import { ref } from "vue";
import { fetchWithAuthToken } from "../utils/api";
import type { Vehicle } from "../types/vehicle";

export const useVehicleStore = defineStore("vehicles", () => {
    const vehicles = ref<Vehicle[]>([]);

    const fetchVehicles = async () => {
        try {
            const response = await fetchWithAuthToken<Vehicle[]>({
                url: "vehicles/",
            });

            vehicles.value = response;

            return vehicles.value;
        } catch (error) {
            console.error("Error al obtener vehículos: ", error);
            throw error;
        }
    };

    return {
        vehicles,
        fetchVehicles,
    };
});
