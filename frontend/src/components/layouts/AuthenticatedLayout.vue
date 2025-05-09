<template>
    <v-app>
        <v-navigation-drawer app v-model="drawer">
            <v-list>
                <v-list-item
                    v-for="link in links"
                    :key="link.to"
                    :to="link.to"
                    link
                    router
                >
                    <v-list-item-title>{{ link.title }}</v-list-item-title>
                </v-list-item>
            </v-list>

            <v-hover>
                <template #default="{ isHovering, props }">
                    <div
                        v-bind="props"
                        class="px-4 py-2 cursor-pointer transition"
                        :class="{ 'bg-grey-lighten-4': isHovering }"
                        @click="auth.logout"
                        style="
                            transition: background-color 0.3s ease,
                                color 0.3s ease;
                        "
                    >
                        <div
                            v-bind="props"
                            :class="{ 'text-red': isHovering }"
                            style="
                                transition: background-color 0.3s ease,
                                    color 0.3s ease;
                            "
                        >
                            Cerrar Sesión
                        </div>
                    </div>
                </template>
            </v-hover>
        </v-navigation-drawer>

        <v-app-bar app>
            <v-app-bar-nav-icon @click="drawer = !drawer">
                <v-icon :icon="'mdi-menu'" color="black" />
            </v-app-bar-nav-icon>
            <v-toolbar-title>SPA</v-toolbar-title>
        </v-app-bar>

        <v-main>
            <router-view />
        </v-main>
    </v-app>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "../../stores/auth";

const role = ref(localStorage.getItem("role"));
const drawer = ref(false);

const links = [
    { title: "Vehículos", to: "/vehicles" },
    ...(role.value === "admin" ? [{ title: "Usuarios", to: "/users" }] : []),
];

const auth = useAuthStore();
</script>
