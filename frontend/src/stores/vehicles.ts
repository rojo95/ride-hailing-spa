import { defineStore } from "pinia";
import { ref } from "vue";
import { fetchWithAuthToken, handleAxiosError } from "../utils/api";
import type {
    UpdateVehicleForm,
    Vehicle,
    VehicleForm,
    VehiclesResponse,
} from "../types/vehicle";
import type { CarBrandResponse } from "../types/carBrand";
import type { Driver, DriverForm, UpdateDriverForm } from "../types/driver";
import type { FIleUploadResponse } from "../types/file";

export const useVehicleStore = defineStore("vehicles", () => {
    const error = ref("");
    const vehicles = ref<VehiclesResponse | null>(null);
    const carBrands = ref<CarBrandResponse[]>([]);

    const setError = (message: string) => {
        error.value = message;
    };
    const clearError = () => {
        error.value = "";
    };

    const fetchVehicles = async ({
        page,
        limit,
        search,
        filteredBy,
    }: {
        page: number;
        limit: number;
        search?: string;
        filteredBy: number;
    }) => {
        clearError();
        try {
            const query = new URLSearchParams();
            if (search) query.append("search", search);

            const response = await fetchWithAuthToken<VehiclesResponse>({
                url: `vehicles/${page}/${limit}/${filteredBy}${
                    search ? "?" + query.toString() : ""
                }`,
            });

            vehicles.value = response;

            return vehicles.value;
        } catch (err) {
            setError(handleAxiosError(err) || "Error al obtener vehículos");
            console.error(`${error.value}: "`, err);
            throw err;
        }
    };

    const fetchCarBrand = async () => {
        clearError();
        try {
            const response = await fetchWithAuthToken<CarBrandResponse[]>({
                url: "brands/",
            });

            carBrands.value = response;

            return carBrands.value;
        } catch (err) {
            error.value = "Error al obtener marcas y modelos";
            console.error(`${error.value}: "`, err);
            throw err;
        }
    };

    type RegisterDriverVehicleResponse = { driver: Driver; vehicle: Vehicle };

    const createVehicle = async ({
        driver,
        vehicle,
    }: {
        driver: DriverForm;
        vehicle: VehicleForm;
    }): Promise<RegisterDriverVehicleResponse | void> => {
        clearError();
        if (
            !vehicle.year ||
            !vehicle.model_id ||
            !driver.avatar ||
            !vehicle.capacity ||
            !vehicle.picture
        )
            return;

        try {
            const avatarForm = new FormData();
            avatarForm.append("name", driver.idCard.toLowerCase());
            avatarForm.append("file", driver.avatar);
            const avatarFile = await fetchWithAuthToken<FIleUploadResponse>({
                url: "files/upload",
                method: "POST",
                data: avatarForm,
            });

            const pictureForm = new FormData();
            pictureForm.append("name", vehicle.plate.toLowerCase());
            pictureForm.append("file", vehicle.picture);
            const pictureFile = await fetchWithAuthToken<FIleUploadResponse>({
                url: "files/upload",
                method: "POST",
                data: pictureForm,
            });

            const urlBase = import.meta.env.VITE_API_HOST;

            const response =
                await fetchWithAuthToken<RegisterDriverVehicleResponse>({
                    url: "vehicles",
                    method: "POST",
                    data: {
                        ...driver,
                        plate: vehicle.plate,
                        model_id: vehicle.model_id,
                        year: new Date(vehicle.year, 0),
                        color: vehicle.color,
                        capacity: vehicle.capacity,
                        avatar: urlBase + avatarFile?.url,
                        picture: urlBase + pictureFile?.url,
                        status: vehicle.status,
                    },
                });

            return response;
        } catch (err) {
            setError(handleAxiosError(err) || "Error al crear el vehículo");
            console.error(`${error.value}: "`, err);
            throw err;
        }
    };

    const updateVehicle = async ({
        vehicleId,
        driver,
        vehicle,
    }: {
        vehicleId: string;
        driver: UpdateDriverForm;
        vehicle: UpdateVehicleForm;
    }): Promise<RegisterDriverVehicleResponse | void> => {
        clearError();
        if (!vehicle.year || !vehicle.model_id || !vehicle.capacity) return;

        try {
            let avatarFile = null;
            if (driver.avatar) {
                const avatarForm = new FormData();
                avatarForm.append("name", driver.idCard.toLowerCase());
                avatarForm.append("file", driver.avatar);
                avatarFile = await fetchWithAuthToken<FIleUploadResponse>({
                    url: "files/upload",
                    method: "POST",
                    data: avatarForm,
                });
            }

            let pictureFile = null;
            if (vehicle.picture) {
                const pictureForm = new FormData();
                pictureForm.append("name", vehicle.plate.toLowerCase());
                pictureForm.append("file", vehicle.picture);
                pictureFile = await fetchWithAuthToken<FIleUploadResponse>({
                    url: "files/upload",
                    method: "POST",
                    data: pictureForm,
                });
            }

            const urlBase = import.meta.env.VITE_API_HOST;

            const response =
                await fetchWithAuthToken<RegisterDriverVehicleResponse>({
                    url: "vehicles/" + vehicleId,
                    method: "PUT",
                    data: {
                        ...driver,
                        plate: vehicle.plate,
                        model_id: vehicle.model_id,
                        year: new Date(vehicle.year, 0),
                        color: vehicle.color,
                        capacity: vehicle.capacity,
                        ...(driver.avatar && {
                            avatar: urlBase + avatarFile?.url,
                        }),
                        ...(vehicle.picture && {
                            picture: urlBase + pictureFile?.url,
                        }),
                        status: vehicle.status,
                    },
                });

            return response;
        } catch (err) {
            setError(handleAxiosError(err) || "Error al crear el vehículo");
            console.error(`${error.value}: "`, err);
            throw error.value;
        }
    };

    async function getVehicleById(_id: string) {
        clearError();
        try {
            const response = await fetchWithAuthToken<Vehicle>({
                url: "vehicles/" + _id,
                method: "GET",
            });

            return response;
        } catch (err) {
            setError(
                handleAxiosError(err) ||
                    "Error al obtener los datos del vehículo"
            );
            console.error(`${error.value}: "`, err);
            throw error.value;
        }
    }

    async function deleteVehicle(id: string) {
        clearError();
        try {
            const response = await fetchWithAuthToken<{ message: string }>({
                url: "vehicles/",
                method: "DELETE",
                data: {
                    id,
                },
            });

            return response;
        } catch (err) {
            setError(
                handleAxiosError(err) ||
                    "Error al obtener los datos del vehículo"
            );
            console.error(`${error.value}: "`, err);
            throw error.value;
        }
    }

    async function updateStatus(
        idVehicle: string,
        newStatus: number
    ): Promise<Vehicle> {
        clearError();
        try {
            const response = await fetchWithAuthToken<Vehicle>({
                url: "vehicles/status/" + idVehicle,
                method: "PUT",
                data: {
                    status: newStatus,
                },
            });

            return response;
        } catch (err) {
            setError(
                handleAxiosError(err) ||
                    "Error al obtener los datos del vehículo"
            );
            console.error(`${error.value}: "`, err);
            throw error.value;
        }
    }

    return {
        error,
        vehicles,
        fetchVehicles,
        carBrands,
        fetchCarBrand,
        createVehicle,
        getVehicleById,
        deleteVehicle,
        updateVehicle,
        updateStatus,
    };
});
