<template>
    <div class="d-flex align-center justify-center h-screen">
        <v-card class="pa-4 w-75 h-75">
            <v-card-title class="text-h5">
                Bienvenido, {{ user?.email }}
            </v-card-title>

            <v-card-subtitle> Rol: {{ user?.role }} </v-card-subtitle>

            <v-btn color="secondary" class="mt-4" @click="auth.logout">
                Cerrar sesión
            </v-btn>
        </v-card>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useAuthStore } from "../stores/auth";
import { fetchWithAuthToken } from "../utils/api";
import type { User } from "../types/user";

const user = ref<{ email: string; role: string } | null>(null);
const auth = useAuthStore();

onMounted(async () => {
    const token = auth.token;
    if (!token) return auth.logout();

    try {
        const response = await fetchWithAuthToken<User>({ url: "users/me" });
        user.value = response;
    } catch (err) {
        alert("Error al consultar datos.");
        console.error(err);
    }
});
</script>
