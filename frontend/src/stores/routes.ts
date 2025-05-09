import { defineStore } from "pinia";
import { ref } from "vue";
import type { Route, RouteBase } from "../types/route";
import { fetchWithAuthToken, handleAxiosError } from "../utils/api";

export const useRouteStore = defineStore("routes", () => {
    const error = ref("");
    const loading = ref(false);

    const setError = (message: string) => {
        error.value = message;
    };
    const clearError = () => {
        error.value = "";
    };

    const createRoute = async ({
        from,
        to,
        status,
        vehicle_id,
    }: RouteBase): Promise<Route> => {
        clearError();
        loading.value = true;

        try {
            const route = await fetchWithAuthToken<Route>({
                url: "routes/",
                method: "POST",
                data: { from, to, status, vehicle_id },
            });

            return route;
        } catch (err) {
            setError(handleAxiosError(err));
            throw error.value;
        } finally {
            loading.value = false;
        }
    };

    return {
        error,
        createRoute,
    };
});
