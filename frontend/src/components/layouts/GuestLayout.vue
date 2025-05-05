<template>
    <v-app>
        <div>
            <v-row no-gutters>
                <v-col cols="12" sm="6">
                    <v-hover>
                        <template #default="{ isHovering, props }">
                            <router-link
                                v-bind="props"
                                to="/"
                                class="ma-2 pa-2 transition"
                                style="
                                    display: inline-block;
                                    color: inherit;
                                    text-decoration: none;
                                    transition: background-color 0.3s ease,
                                        color 0.3s ease;
                                "
                                :class="{ 'bg-grey-lighten-4': isHovering }"
                                v-if="route.name !== 'login'"
                            >
                                Iniciar Sesión
                            </router-link>
                        </template>
                    </v-hover>
                </v-col>

                <v-col cols="12" sm="6" class="text-right">
                    <v-hover>
                        <template #default="{ isHovering, props }">
                            <router-link
                                v-bind="props"
                                to="/register"
                                class="ma-2 pa-2"
                                style="
                                    display: inline-block;
                                    color: inherit;
                                    text-decoration: none;
                                    transition: background-color 0.3s ease,
                                        color 0.3s ease;
                                "
                                :class="{ 'bg-grey-lighten-4': isHovering }"
                                v-if="route.name !== 'register'"
                            >
                                Registrarse
                            </router-link>
                        </template>
                    </v-hover>
                </v-col>
            </v-row>
        </div>
        <v-main class="d-flex align-center justify-center">
            <router-view />
        </v-main>
    </v-app>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";

const route = useRoute();
</script>

<style lang="scss" scoped></style>
