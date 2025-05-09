<template>
    <v-container>
        <v-card class="pa-4">
            <v-card-title>Usuarios</v-card-title>
            <v-card class="w-100">
                <v-list>
                    <v-list-item
                        v-for="item in items"
                        :key="item.email"
                        link
                        router
                    >
                        <v-list-item-title class="d-flex">
                            <div class="w-100">
                                {{ item.email }}
                            </div>
                            <div>{{ item.role }}</div>
                        </v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-card>
        </v-card>
    </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useUserStore } from "../stores/users";
import { showToast } from "../utils/swalToast";

const userStore = useUserStore();
const items = ref<{ email: string; role: string }[]>([]); // Hacer items reactivo

async function getUsers() {
    try {
        const users = await userStore.fetchUsers();
        if (!users) return;

        items.value = users; // Asignar los usuarios a items
    } catch (error) {
        showToast({ message: userStore.error, icon: "error" });
        console.error("Error al obtener usuarios:", error);
    }
}

onMounted(() => {
    getUsers();
});
</script>
