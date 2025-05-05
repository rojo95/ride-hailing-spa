import { defineStore } from "pinia";
import { ref } from "vue";
import { useAuthStore } from "./auth";
import { fetchWithAuthToken } from "../utils/api";
import type { User } from "../types/user";

export const useUserStore = defineStore("users", () => {
    const users = ref<User[]>([]);
    const auth = useAuthStore();

    const fetchUsers = async () => {
        const token = auth.token;
        if (!token) return auth.logout();

        try {
            const response = await fetchWithAuthToken<User[]>({
                url: "users/",
            });

            users.value = response;

            return users.value;
        } catch (error) {
            console.error("Error al obtener usuarios:", error);
            throw error;
        }
    };

    return {
        users,
        fetchUsers,
    };
});
