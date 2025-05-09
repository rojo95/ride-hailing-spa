import { defineStore } from "pinia";
import { ref } from "vue";
import { useAuthStore } from "./auth";
import { fetchWithAuthToken, handleAxiosError } from "../utils/api";
import type { User } from "../types/user";

export const useUserStore = defineStore("users", () => {
    const error = ref("");
    const users = ref<User[]>([]);
    const auth = useAuthStore();

    const fetchUsers = async () => {
        error.value = "";
        const token = auth.token;
        if (!token) return auth.logout();

        try {
            const response = await fetchWithAuthToken<User[]>({
                url: "users/",
            });

            users.value = response;

            return users.value;
        } catch (err) {
            error.value = handleAxiosError(err);
            console.error("Error al obtener usuarios:", err);
            throw error;
        }
    };

    return {
        error,
        users,
        fetchUsers,
    };
});
