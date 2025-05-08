<template>
    <div class="pa-10">
        <v-card class="w-100" width="300">
            <v-card-title class="d-flex justify-space-between">
                <p>Vehículos</p>
                <router-link to="/vehicles/create">
                    <v-btn
                        color="green"
                        variant="outlined"
                        class="text-white rounded-lg"
                    >
                        <v-icon color="green">mdi-plus</v-icon>
                    </v-btn>
                </router-link>
            </v-card-title>

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
                                            <v-img
                                                :src="item.driver_id.avatar"
                                                alt="Avatar"
                                                width="100%"
                                                height="100%"
                                                cover
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
                            <v-list-item-title class="font-weight-medium">
                                Detalles del Vehículo
                            </v-list-item-title>
                            <v-list-item-content>
                                <div class="d-flex justify-space-between">
                                    Color: {{ item.color }}<br />
                                    Capacidad: {{ item.capacity }}<br />
                                    Estado:
                                    {{ getStatus(item.status_id).description }}
                                    <br />

                                    <div class="text-center">
                                        <v-menu location="start">
                                            <template
                                                v-slot:activator="{ props }"
                                            >
                                                <v-btn
                                                    icon="$vuetify"
                                                    variant="flat"
                                                    v-bind="props"
                                                >
                                                    <v-icon>
                                                        mdi-dots-vertical
                                                    </v-icon>
                                                </v-btn>
                                            </template>

                                            <v-list>
                                                <v-list-item
                                                    v-for="(
                                                        menuItem, index
                                                    ) in getMenuItems(item)"
                                                    :key="index"
                                                    :value="index"
                                                    @click="menuItem.action"
                                                >
                                                    <v-list-item-title>{{
                                                        menuItem.title
                                                    }}</v-list-item-title>
                                                </v-list-item>
                                            </v-list>
                                        </v-menu>
                                    </div>
                                </div>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list-item-group>
                </v-list-group>
            </v-list>
        </v-card>
    </div>

    <v-alert v-if="message" type="success" class="mt-4 toast-message">{{
        message
    }}</v-alert>

    <v-dialog v-model="isActiveModal" max-width="800">
        <template v-slot:default>
            <v-card>
                <v-card-title>Seleccione el Origen del Viaje</v-card-title>
                <v-card-text>
                    <div class="py-3">
                        <p>Origen:</p>
                        <p>Destino:</p>
                    </div>
                    <template v-if="isActiveModal">
                        <div class="leaflet-map">
                            <l-map
                                ref="map"
                                v-model:zoom="zoom"
                                v-model:center="center"
                                :useGlobalLeaflet="false"
                                @click="onMapClick"
                            >
                                <!-- capa base -->
                                <l-tile-layer
                                    url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
                                    layer-type="base"
                                    name="Stadia Maps Basemap"
                                ></l-tile-layer>

                                <!-- marcadores -->
                                <l-marker
                                    v-if="fromMarker"
                                    :lat-lng="fromMarker"
                                />
                                <l-marker v-if="toMarker" :lat-lng="toMarker" />

                                <!-- línea entre puntos -->
                                <l-polyline
                                    v-if="fromMarker && toMarker"
                                    :lat-lngs="[fromMarker, toMarker]"
                                    :weight="4"
                                    color="blue"
                                />
                            </l-map>
                        </div>
                    </template>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="toggleModal">Cerrar</v-btn>
                </v-card-actions>
            </v-card>
        </template>
    </v-dialog>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from "vue";
import type { Vehicle } from "../../types/vehicle";
import { useVehicleStore } from "../../stores/vehicles";
import { useRoute } from "vue-router";
import { LMap, LTileLayer, LMarker, LPolyline } from "@vue-leaflet/vue-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";

function getMenuItems(vehicle: Vehicle) {
    return [
        {
            title: "Gestionar Ruta",
            action: () => getLastRoute(vehicle._id),
        },
        {
            title: "Ver Más",
            action: () => {
                console.log("Ver Más de:", vehicle._id);
            },
        },
        {
            title: "Editar",
            action: () => {
                console.log("Editar:", vehicle._id);
            },
        },
        {
            title: "Deshabilitar",
            action: () => {
                console.log("Deshabilitar:", vehicle._id);
            },
        },
    ];
}

const openGroup = ref<string | null>(null); // Cambia a null para que no haya grupos abiertos inicialmente
const vehicleStore = useVehicleStore();
const route = useRoute();
const message = route.query.msg;
const vehicles = ref<Vehicle[]>([]);
const isActiveModal = ref<boolean>(false);
const zoom = ref(6);
const center = ref<[number, number]>([51.505, -0.09]);
const clickCount = ref(0);
const fromMarker = ref<[number, number] | null>(null);
const toMarker = ref<[number, number] | null>(null);

const routeControl = ref<any>(null);
const fromLatLng = ref<L.LatLng | null>(null);
const toLatLng = ref<L.LatLng | null>(null);

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

async function getLastRoute(_id: string) {
    toggleModal();
}

function toggleModal() {
    isActiveModal.value = !isActiveModal.value;
}

const mapRef = ref();

watch(isActiveModal, (val) => {
    if (val) {
        nextTick(() => {
            setTimeout(() => {
                mapRef.value?.leafletObject?.invalidateSize();
            }, 300); // Espera a que el modal esté visible
        });
    }
});

function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                center.value = [
                    position.coords.latitude,
                    position.coords.longitude,
                ];
            },
            (error) => {
                console.error("Error obteniendo ubicación:", error);
                // Fallback por si falla
                center.value = [51.505, -0.09];
            }
        );
    } else {
        console.warn("Geolocalización no soportada.");
    }
}

function onMapClick(e: L.LeafletMouseEvent) {
    const { latlng } = e;

    if (clickCount.value === 0) {
        if (fromMarker.value) fromMarker.value = null;
        fromMarker.value = [latlng.lat, latlng.lng];
        clickCount.value = 1;
    } else {
        if (toMarker.value) toMarker.value = null;
        toMarker.value = [latlng.lat, latlng.lng];
        clickCount.value = 0;
        drawRoute();
    }
}

function drawRoute() {
    if (!fromLatLng.value || !toLatLng.value) return;

    if (routeControl.value) {
        mapRef.value.leafletObject.removeControl(routeControl.value);
    }

    routeControl.value = L.Routing.control({
        waypoints: [fromLatLng.value, toLatLng.value],
        routeWhileDragging: true,
        show: false,
        addWaypoints: false,
    }).addTo(mapRef.value.leafletObject);
}

watch(isActiveModal, (val) => {
    if (val) {
        nextTick(() => {
            setTimeout(() => {
                const map = mapRef.value?.leafletObject;
                map.invalidateSize();
                map.on("click", onMapClick); // <-- aquí agregas el click listener
            }, 300);
        });
    }
});

onMounted(() => {
    getVehicles();
    getCurrentLocation();
});
</script>

<style>
.toast-message {
    position: fixed;
    right: 10px;
    bottom: 10px;
}

.leaflet-map {
    height: 400px;
    width: 100%;
}
</style>
