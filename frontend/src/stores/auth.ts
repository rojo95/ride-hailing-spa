import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { fetchWithoutTokenAuth, handleAxiosError } from "../utils/api";
import type { User } from "../types/user";

export type RegisterRequest = {
    email: string;
    password: string;
    secretQuestion: string;
    secretAnswer: string;
};

export const useAuthStore = defineStore("auth", () => {
    const token = ref<string | null>(localStorage.getItem("token"));
    const role = ref<string | null>(localStorage.getItem("role"));
    const error = ref<string>("");
    const loading = ref(false);
    const router = useRouter();

    const isAuthenticated = computed(() => !!token.value);
    const isAdmin = computed(() => role.value === "admin");

    const setError = (message: string) => {
        error.value = message;
    };

    const clearError = () => {
        error.value = "";
    };

    const login = async (form: { email: string; password: string }) => {
        clearError();
        loading.value = true;
        try {
            const { token: sessionToken, user } = await fetchWithoutTokenAuth<{
                token: string;
                user: User;
            }>({
                url: "auth",
                method: "POST",
                data: form,
            });
            if (!sessionToken || !user.role) {
                throw new Error("No se han retornado valores válidos");
            }
            token.value = sessionToken;
            role.value = user.role;
            localStorage.setItem("token", token.value);
            localStorage.setItem("role", role.value);
            router.push("/dashboard");
            return null; // Indica que no hubo error
        } catch (err) {
            setError(handleAxiosError(err));
            return error.value; // Devuelve el mensaje de error
        } finally {
            loading.value = false;
        }
    };

    const getSecretQuestion = async (form: { email: string }) => {
        clearError();
        loading.value = true;

        try {
            const { question } = await fetchWithoutTokenAuth<{
                question: string;
            }>({
                url: "auth/secret-question",
                method: "POST",
                data: { email: form.email },
            });

            if (!question) {
                throw new Error("No se han retornado valores válidos");
            }

            return question;
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error desconocido");
        } finally {
            loading.value = false;
        }
    };

    const resetPassword = async (form: {
        email: string;
        secretAnswer: string;
        newPassword: string;
    }): Promise<boolean> => {
        clearError();
        loading.value = true;

        try {
            const { email, secretAnswer, newPassword } = form;
            const response = await fetchWithoutTokenAuth<User>({
                url: "auth/reset-password",
                method: "POST",
                data: { email, secretAnswer, newPassword },
            });

            if (!response?._id) {
                throw new Error("No se han retornado valores válidos");
            }

            return true;
        } catch (err) {
            setError(handleAxiosError(err));
            throw error.value;
        } finally {
            loading.value = false;
        }
    };

    const registerUser = async (form: RegisterRequest): Promise<void> => {
        clearError();
        loading.value = true;

        try {
            const { email, password, secretAnswer, secretQuestion } = form;
            const response = await fetchWithoutTokenAuth<User>({
                url: "auth/register",
                method: "POST",
                data: { email, password, secretAnswer, secretQuestion },
            });

            if (!response?.email) return;

            login({ email: response?.email, password });
        } catch (err) {
            setError(handleAxiosError(err));
            throw error.value;
        } finally {
            loading.value = false;
        }
    };

    const logout = () => {
        token.value = null;
        role.value = null;
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        router.push("/login");
    };

    return {
        token,
        role,
        error,
        loading,
        isAuthenticated,
        isAdmin,
        login,
        logout,
        getSecretQuestion,
        resetPassword,
        registerUser,
    };
});
