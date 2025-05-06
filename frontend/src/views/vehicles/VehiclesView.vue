<template>
    <div class="pa-10">
        <v-card class="w-100" width="300">
            <v-card-title>Vehículos</v-card-title>

            <v-list>
                <v-list-group
                    v-for="item in vehicles"
                    :key="item._id"
                    v-model:open="openGroup"
                    :value="item.plate"
                >
                    <template v-slot:activator="{ props }">
                        <v-list-item v-bind="props">
                            <v-list-item-title class="font-weight-bold">
                                Vehículo: {{ item.plate }}
                            </v-list-item-title>
                            <div class="d-flex justify-space-between">
                                <v-list-item-content
                                    class="d-flex align-sm-center"
                                >
                                    <div>
                                        <v-avatar size="24" class="mr-2">
                                            <img
                                                :src="item.driver_id.avatar"
                                                alt="Avatar"
                                                width="100%"
                                            />
                                        </v-avatar>
                                    </div>
                                    <div>
                                        <v-list-item-title>{{
                                            item.driver_id.name
                                        }}</v-list-item-title>
                                        <v-list-item-subtitle
                                            >{{
                                                `${item.model_id.brand_id.name} ${item.model_id.name}`
                                            }}
                                            ({{
                                                new Date(
                                                    item.year
                                                ).getFullYear()
                                            }})</v-list-item-subtitle
                                        >
                                    </div>
                                </v-list-item-content>
                                <div
                                    class="rounded-circle me-3"
                                    :class="getStatus(item.status_id).color"
                                    style="width: 10px; height: 10px"
                                />
                            </div>
                        </v-list-item>
                    </template>

                    <v-list-item-group>
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title class="font-weight-medium">
                                    Detalles del Vehículo
                                </v-list-item-title>
                                <v-list-item-content>
                                    Color: {{ item.color }}<br />
                                    Capacidad: {{ item.capacity }}<br />
                                    Estado:
                                    {{ getStatus(item.status_id).description }}
                                    <br />
                                </v-list-item-content>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list-item-group>
                </v-list-group>
            </v-list>
        </v-card>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { Vehicle } from "../../types/vehicle";
import { useVehicleStore } from "../../stores/vehicles";

const openGroup = ref<string | null>(null); // Cambia a null para que no haya grupos abiertos inicialmente
const vehicleStore = useVehicleStore();

const vehicles = ref<Vehicle[]>([]);

const getStatus = (status_id: number) => {
    switch (status_id) {
        case 1:
            return { description: "Libre", color: "bg-green" };
        case 2:
            return { description: "Ocupado", color: "bg-red" };
        case 3:
            return { description: "Inactivo", color: "bg-grey" };
        default:
            return { description: "Inactivo", color: "bg-grey" };
    }
};

async function getVehicles() {
    try {
        const data = await vehicleStore.fetchVehicles();
        if (!data) return;

        vehicles.value = data;
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
    }
}

onMounted(() => {
    getVehicles();
});
</script>
