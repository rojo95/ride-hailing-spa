import type { AxiosRequestConfig, AxiosResponse } from "axios";
import instance from "../plugins/axios";
import { useAuthStore } from "../stores/auth";
import axios from "axios";

// Tipo genérico para la respuesta
type ApiResponse<T> = Promise<T>;

type Fetch = {
    url: string;
    method?: "GET" | "POST" | "PUT";
    data?: any;
    options?: AxiosRequestConfig;
};

// Función para hacer solicitudes que requieren token
export const fetchWithoutTokenAuth = async <T>({
    url,
    method = "GET",
    data,
    options,
}: Fetch): ApiResponse<T> => {
    try {
        const response: AxiosResponse<T> = await instance.request({
            url,
            method,
            data,
            ...options,
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching without token:", error);

        throw error;
    }
};

// Función para hacer solicitudes con token
export const fetchWithAuthToken = async <T>({
    url,
    method = "GET",
    data,
    options,
}: Fetch): ApiResponse<T> => {
    const auth = useAuthStore();
    const token = auth.token;

    if (!token) {
        auth.logout();
        throw new Error("No token available, user is logged out.");
    }

    try {
        // Crea un objeto de headers base con el Authorization
        const baseHeaders = {
            Authorization: `Bearer ${token}`,
        };

        // Combina los headers base con los headers de options
        const combinedHeaders = {
            ...baseHeaders,
            ...options?.headers, // Esto asegura que se mantengan los headers existentes
        };

        const response: AxiosResponse<T> = await instance.request<T>({
            url,
            method,
            data,
            headers: combinedHeaders, // Usa combinedHeaders aquí
            ...options, // Aquí no incluimos headers para evitar sobrescribir
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching with token:", error);
        throw error;
    }
};

export const handleAxiosError = (err: unknown) => {
    if (axios.isAxiosError(err)) {
        const errorMessage =
            err.response?.data?.error ||
            err.response?.data?.message ||
            "Error desconocido";
        const statusCode = err.response?.status;
        return `Error ${statusCode}: ${errorMessage}`;
    }
    return "Error desconocido";
};
