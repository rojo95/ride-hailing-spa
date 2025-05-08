<template>
    <div class="pa-10">
        <v-card class="w-100" width="300">
            <v-card-title class="d-flex justify-space-between">
                <p>Vehículos</p>
                <router-link to="/vehicles/create">
                    <v-btn
                        color="green"
                        variant="elevated"
                        class="text-white rounded-lg"
                    >
                        <v-icon color="white">mdi-plus</v-icon>
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
                                    :class="getStatus(item).color"
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
                                    {{ getStatus(item).description }}
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
                <v-card-title>
                    {{
                        clickCount === 0
                            ? !origen
                                ? "Seleccione"
                                : "Click para Modificar"
                            : clickCount === 1
                            ? !destino
                                ? "Seleccione"
                                : "Click para Modificar"
                            : "Click para Modificar"
                    }}
                    el {{ clickCount === 0 ? "Origen" : "Destino" }} del Viaje
                </v-card-title>
                <v-card-text>
                    <div class="pb-3 d-flex ga-10">
                        <p>
                            <strong v-if="origen">Origen:</strong> {{ origen }}
                        </p>
                        <p>
                            <strong v-if="destino">Destino:</strong>
                            {{ destino }}
                        </p>
                    </div>
                    <template v-if="isActiveModal">
                        <div class="leaflet-map">
                            <l-map
                                ref="mapRef"
                                v-model:zoom="zoom"
                                v-model:center="center"
                                :useGlobalLeaflet="false"
                                @click="onMapClick"
                            >
                                <!-- capa base -->
                                <l-tile-layer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    layer-type="base"
                                    name="Stadia Maps Basemap"
                                ></l-tile-layer>

                                <!-- marcadores -->
                                <l-marker
                                    v-if="fromMarker"
                                    :lat-lng="fromMarker"
                                    :draggable="true"
                                    @dragstart="disableMapDragging"
                                    @dragend="enableMapDragging"
                                    @moveend="onFromMarkerMoved"
                                />

                                <l-marker
                                    v-if="toMarker"
                                    :lat-lng="toMarker"
                                    :draggable="true"
                                    @dragstart="disableMapDragging"
                                    @dragend="enableMapDragging"
                                    @moveend="onToMarkerMoved"
                                />

                                <!-- línea entre puntos -->
                                <!-- <l-polyline
                                    v-if="fromMarker && toMarker"
                                    :lat-lngs="[fromMarker, toMarker]"
                                    :weight="4"
                                    color="red"
                                /> -->
                            </l-map>
                        </div>
                    </template>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <div class="py-5">
                        <v-btn @click="closeMap">Cancelar</v-btn>
                        <v-btn @click="createRoute" color="green"
                            >Crear Ruta</v-btn
                        >
                    </div>
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
import { LMap, LTileLayer, LMarker } from "@vue-leaflet/vue-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import { useRouteStore } from "../../stores/routes";
import Swal from "sweetalert2";
import type { Location } from "../../types/location";
import { showToast } from "../../utils/swalToast";
import { STATUSES } from "../../constants/routes";

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
const zoom = ref(17);
const center = ref<[number, number]>([51.505, -0.09]);
const clickCount = ref(0);
const fromMarker = ref<[number, number] | null>(null);
const toMarker = ref<[number, number] | null>(null);
const routeStore = useRouteStore();
const routeControl = ref<any>(null);
const fromLatLng = ref<L.LatLng | null>(null);
const toLatLng = ref<L.LatLng | null>(null);
const activeVehicle = ref<string | null>(null);
const origen = ref<string>("");
const destino = ref<string>("");

const getStatus = ({ lastRoute }: Vehicle) => {
    if (lastRoute?.status === STATUSES.ACTIVE) {
        return { description: "Ocupado", color: "bg-red" };
    }
    return { description: "Libre", color: "bg-green" };
};

async function getAddressFromLatLng(lat: number, lon: number): Promise<string> {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.display_name || "Dirección no encontrada";
    } catch (error) {
        console.error("Error al obtener la dirección:", error);
        return "Error al obtener la dirección";
    }
}

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
    activeVehicle.value = _id;
    isActiveModal.value = true;
    setTimeout(() => {
        cleanMap();
    }, 100);
}

const mapRef = ref();

watch(isActiveModal, async (val) => {
    if (val) {
        await nextTick();
        setTimeout(() => {
            const map = mapRef.value?.leafletObject;
            map?.invalidateSize();
            map?.on("click", onMapClick);
        }, 300);
    } else if (!activeVehicle.value) {
        cleanMap();
    }
});

function closeMap() {
    activeVehicle.value = null;
    isActiveModal.value = false;
}

function cleanMap() {
    const map = mapRef.value?.leafletObject;
    map?.off("click", onMapClick);
    if (routeControl.value) {
        map.removeControl(routeControl.value);
        routeControl.value = null;
    }
    // Limpiar estado
    fromMarker.value = null;
    toMarker.value = null;
    fromLatLng.value = null;
    toLatLng.value = null;
    clickCount.value = 0;
    origen.value = "";
    destino.value = "";
}

function disableMapDragging() {
    mapRef.value?.leafletObject.dragging.disable();
}
function enableMapDragging() {
    mapRef.value?.leafletObject.dragging.enable();
}

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
        fromMarker.value = [latlng.lat, latlng.lng];
        fromLatLng.value = L.latLng(latlng.lat, latlng.lng);
        clickCount.value = 1;
        getAddressFromLatLng(latlng.lat, latlng.lng).then((address) => {
            // Actualiza la dirección de Origen
            origen.value = address;
        });
    } else {
        toMarker.value = [latlng.lat, latlng.lng];
        toLatLng.value = L.latLng(latlng.lat, latlng.lng);
        clickCount.value = 0;
        getAddressFromLatLng(latlng.lat, latlng.lng).then((address) => {
            // Actualiza la dirección de Destino
            destino.value = address;
        });
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
        fitSelectedRoutes: false,
        createMarker: () => null,
    } as any).addTo(mapRef.value.leafletObject);
}

function onFromMarkerMoved(e: L.LeafletEvent) {
    const marker = e.target as L.Marker;
    fromLatLng.value = marker.getLatLng();
    if (toLatLng.value) drawRoute();
}

function onToMarkerMoved(e: L.LeafletEvent) {
    const marker = e.target as L.Marker;
    toLatLng.value = marker.getLatLng();
    if (fromLatLng.value) drawRoute();
}

async function createRoute() {
    if (!activeVehicle?.value || !fromLatLng.value || !toLatLng.value) return;

    const vehicle = activeVehicle?.value;

    const from: Location = {
        lat: fromLatLng.value?.lat,
        lon: fromLatLng.value?.lng,
    };
    const to: Location = {
        lat: toLatLng.value?.lat,
        lon: toLatLng.value?.lng,
    };

    isActiveModal.value = false;

    Swal.fire({
        title: "¿Seguro que desea registrar los datos?",
        text: "Verifique que los datos tanto del conductor como del vehículo sean correctos.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#4CAF50",
        cancelButtonColor: "#BDBDBD",
        confirmButtonText: "Aceptar",
        cancelButtonText: "Cancelar",
        customClass: {
            popup: "my-swal-popup",
        },
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                await routeStore.createRoute({
                    from,
                    to,
                    status: STATUSES.ACTIVE,
                    vehicle_id: vehicle,
                });

                activeVehicle.value = null;
            } catch (err) {
                showToast({
                    message: routeStore.error || "Error al registrar vehículo.",
                    icon: "error",
                });
            }
        } else {
            isActiveModal.value = true;
        }
    });
}

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
    height: 300px;
    width: 100%;
}

.my-swal-popup {
    z-index: 1000000000;
}
</style>
