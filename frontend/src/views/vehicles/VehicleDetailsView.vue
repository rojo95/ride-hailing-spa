<template>
    <FullScreenOverlay :modelValue="isLoading" />
    <div class="d-md-flex ga-5 pa-5">
        <v-container>
            <v-row justify="center">
                <v-col cols="12" sm="9" md="6" lg="3">
                    <v-card class="mx-auto mb-10">
                        <v-img
                            class="text-white"
                            height="300px"
                            :src="vehicle?.driver_id.avatar"
                            cover
                        >
                            <div class="d-flex flex-column h-100">
                                <v-card-title class="d-flex ga-2 px-2">
                                    <v-btn
                                        icon="mdi-chevron-left"
                                        variant="elevated"
                                        color="green"
                                        @click="router.back"
                                    ></v-btn>
                                    <v-spacer></v-spacer>
                                    <!-- <v-btn
                            icon="mdi-pencil"
                            variant="elevated"
                            color="green"
                        ></v-btn>
                        <v-btn
                            icon="mdi-dots-vertical"
                            variant="elevated"
                            color="green"
                        ></v-btn> -->
                                </v-card-title>

                                <v-spacer></v-spacer>

                                <v-card-title class="pb-6 text-center">
                                    <div class="text-h4">
                                        {{
                                            vehicle?.driver_id.name +
                                            " " +
                                            vehicle?.driver_id.lastname
                                        }}
                                    </div>
                                </v-card-title>
                            </div>
                        </v-img>

                        <v-list lines="two">
                            <v-list-item>
                                <template v-slot:prepend>
                                    <v-avatar>
                                        <v-icon
                                            color="indigo"
                                            icon="mdi-card-account-details-outline"
                                        ></v-icon>
                                    </v-avatar>
                                </template>

                                <v-list-item-title>{{
                                    vehicle?.driver_id.idCard
                                }}</v-list-item-title>
                                <v-list-item-subtitle
                                    >Cédula</v-list-item-subtitle
                                >
                            </v-list-item>

                            <v-divider inset></v-divider>

                            <v-list-item>
                                <template v-slot:prepend>
                                    <v-avatar>
                                        <v-icon
                                            color="indigo"
                                            icon="mdi-card-bulleted-outline"
                                        ></v-icon>
                                    </v-avatar>
                                </template>

                                <v-list-item-title v-if="vehicle">
                                    {{
                                        formatDate({
                                            date: vehicle?.driver_id
                                                .licenseExpiry,
                                        })
                                    }}
                                </v-list-item-title>
                                <v-list-item-subtitle>
                                    Vencimiento de Licencia
                                </v-list-item-subtitle>
                            </v-list-item>

                            <v-list-item>
                                <template v-slot:prepend>
                                    <v-avatar>
                                        <v-icon
                                            color="indigo"
                                            icon="mdi-phone"
                                        ></v-icon>
                                    </v-avatar>
                                </template>

                                <v-list-item-title v-if="vehicle">
                                    {{ vehicle?.driver_id.phone }}
                                </v-list-item-title>
                                <v-list-item-subtitle>
                                    Número de teléfono
                                </v-list-item-subtitle>
                            </v-list-item>

                            <v-list-item>
                                <template v-slot:prepend>
                                    <v-avatar>
                                        <v-icon
                                            color="indigo"
                                            icon="mdi-email"
                                        ></v-icon>
                                    </v-avatar>
                                </template>

                                <v-list-item-title v-if="vehicle">
                                    {{ vehicle?.driver_id.email }}
                                </v-list-item-title>
                                <v-list-item-subtitle>
                                    Correo electrónico
                                </v-list-item-subtitle>
                            </v-list-item>

                            <v-list-item>
                                <template v-slot:prepend>
                                    <v-avatar>
                                        <v-icon
                                            color="indigo"
                                            icon="mdi-clock-time-eight-outline"
                                        ></v-icon>
                                    </v-avatar>
                                </template>

                                <v-list-item-title v-if="vehicle">{{
                                    calculateTime(vehicle?.driver_id.createdAt)
                                }}</v-list-item-title>
                                <v-list-item-subtitle
                                    >Activo desde</v-list-item-subtitle
                                >
                            </v-list-item>
                        </v-list>
                    </v-card>
                </v-col>

                <v-col cols="12" sm="9" md="6" lg="3">
                    <v-card class="mx-auto mb-10">
                        <v-img
                            class="text-white"
                            height="300px"
                            :src="vehicle?.picture"
                            cover
                        >
                            <div class="d-flex flex-column h-100">
                                <v-card-title class="pb-6 text-center">
                                    <div class="text-h4">
                                        {{
                                            vehicle?.model_id.name +
                                            " " +
                                            vehicle?.model_id.brand_id.name
                                        }}
                                    </div>
                                </v-card-title>
                            </div>
                        </v-img>

                        <v-list lines="two">
                            <v-list-item>
                                <template v-slot:prepend>
                                    <v-avatar>
                                        <v-icon
                                            color="indigo"
                                            icon="mdi-id-card"
                                        ></v-icon>
                                    </v-avatar>
                                </template>

                                <v-list-item-title>
                                    {{ vehicle?.plate }}
                                </v-list-item-title>
                                <v-list-item-subtitle
                                    >Placa</v-list-item-subtitle
                                >
                            </v-list-item>

                            <v-divider inset></v-divider>

                            <v-list-item>
                                <template v-slot:prepend>
                                    <v-avatar>
                                        <v-icon
                                            color="indigo"
                                            icon="mdi-calendar"
                                        ></v-icon>
                                    </v-avatar>
                                </template>

                                <v-list-item-title v-if="vehicle">
                                    {{
                                        formatDate({
                                            date: vehicle?.year,
                                            onlyYear: true,
                                        })
                                    }}
                                </v-list-item-title>
                                <v-list-item-subtitle>
                                    Año
                                </v-list-item-subtitle>
                            </v-list-item>

                            <v-list-item>
                                <template v-slot:prepend>
                                    <v-avatar>
                                        <v-icon
                                            color="indigo"
                                            icon="mdi-palette"
                                        ></v-icon>
                                    </v-avatar>
                                </template>

                                <v-list-item-title>{{
                                    vehicle?.color
                                }}</v-list-item-title>
                                <v-list-item-subtitle>
                                    Color
                                </v-list-item-subtitle>
                            </v-list-item>

                            <v-divider inset></v-divider>

                            <v-list-item>
                                <template v-slot:prepend>
                                    <v-avatar>
                                        <v-icon
                                            color="indigo"
                                            icon="mdi-account-group"
                                        ></v-icon>
                                    </v-avatar>
                                </template>

                                <v-list-item-title>
                                    {{ vehicle?.capacity }}
                                </v-list-item-title>
                                <v-list-item-subtitle
                                    >Capaccidad</v-list-item-subtitle
                                >
                            </v-list-item>

                            <v-divider inset></v-divider>

                            <v-list-item>
                                <template v-slot:prepend>
                                    <v-avatar>
                                        <v-icon
                                            color="indigo"
                                            icon="mdi-account-group"
                                        ></v-icon>
                                    </v-avatar>
                                </template>

                                <v-list-item-title>
                                    {{
                                        vehicle?.status
                                            ? "Activo"
                                            : "En Mantenimiento"
                                    }}
                                </v-list-item-title>
                                <v-list-item-subtitle
                                    >Estatus</v-list-item-subtitle
                                >
                            </v-list-item>
                        </v-list>
                    </v-card>
                </v-col>

                <v-col cols="12" sm="9" md="12" lg="6">
                    <v-card class="mx-auto w-100 mb-10">
                        <v-list disabled>
                            <v-list-subheader> Rutas </v-list-subheader>

                            <v-list-item
                                v-for="(item, i) in vehicle?.routes"
                                :key="i"
                                v-if="
                                    vehicle?.routes &&
                                    vehicle?.routes?.length > 0
                                "
                            >
                                <div>
                                    {{ routeStatus(item.status).description }}
                                    <div class="d-flex ga-5">
                                        <div>
                                            <v-icon
                                                icon="mdi-car-back"
                                                :color="
                                                    routeStatus(item.status)
                                                        .color
                                                "
                                            ></v-icon>
                                        </div>
                                        <p>
                                            <strong> Desde: </strong>
                                            {{ item.from_address }}
                                        </p>
                                        <p>
                                            <strong> Hasta: </strong>
                                            {{ item.to_address }}
                                        </p>
                                    </div>
                                </div>
                            </v-list-item>
                            <v-list-item v-else>
                                No se le han asignado rutas aún
                            </v-list-item>
                        </v-list>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import FullScreenOverlay from "../../components/FullScreenOverlay.vue";
import { useVehicleStore } from "../../stores/vehicles";
import { useRoute } from "vue-router";
import { showToast } from "../../utils/swalToast";
import type { Vehicle } from "../../types/vehicle";
import { calculateTime, formatDate } from "../../utils/date";
import { useRouter } from "vue-router";
import { STATUSES } from "../../constants/routes";

const router = useRouter();
const isLoading = ref(true);
const vehicleStore = useVehicleStore();
const route = useRoute();
const id = route.params.id;
const vehicle = ref<Vehicle | null>();

const routeStatus = (
    status: number
): { description: string; color: string } => {
    switch (status) {
        case STATUSES.ACTIVE:
            return { description: "Activa", color: "grey" };
        case STATUSES.CANCELLED:
            return { description: "Cancelada", color: "red" };
        case STATUSES.CANCELLED_BY_DRIVER:
            return { description: "Cancelada por el usuario", color: "red" };
        case STATUSES.FINISHED:
            return { description: "Finalizada", color: "green" };
        default:
            return { description: "Activa", color: "grey" };
    }
};

async function getVehicle() {
    if (!id || typeof id !== "string") return;

    try {
        const v = await vehicleStore.getVehicleById(id);

        vehicle.value = v;
    } catch (error) {
        showToast({ message: vehicleStore.error, icon: "error" });
    } finally {
        isLoading.value = false;
    }
}

onMounted(async () => {
    await getVehicle();
});
</script>
