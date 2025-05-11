<template>
    <FullScreenOverlay :modelValue="isLoading" />
    <div class="pa-10">
        <v-container>
            <v-row justify="center">
                <v-col cols="12" sm="10">
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

                        <v-list v-if="vehicles.length > 0">
                            <v-list-group
                                v-for="item in vehicles"
                                :key="item._id"
                                :value="item.plate"
                            >
                                <template v-slot:activator="{ props }">
                                    <v-list-item v-bind="props">
                                        <v-list-item-title
                                            class="font-weight-bold"
                                        >
                                            Vehículo: {{ item.plate }}
                                        </v-list-item-title>
                                        <div
                                            class="d-flex justify-space-between"
                                            v-if="item.driver_id"
                                        >
                                            <v-list-item-content
                                                class="d-flex align-sm-center"
                                            >
                                                <div>
                                                    <v-avatar
                                                        size="24"
                                                        class="mr-2"
                                                    >
                                                        <v-img
                                                            :src="
                                                                item.driver_id
                                                                    .avatar
                                                            "
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
                                                style="
                                                    width: 10px;
                                                    height: 10px;
                                                "
                                            />
                                        </div>
                                    </v-list-item>
                                </template>

                                <v-list-item-group>
                                    <v-list-item>
                                        <v-list-item-title
                                            class="font-weight-medium"
                                        >
                                            Detalles del Vehículo
                                        </v-list-item-title>
                                        <v-list-item-content>
                                            <div
                                                class="d-flex justify-space-between"
                                            >
                                                Color: {{ item.color }}<br />
                                                Capacidad: {{ item.capacity
                                                }}<br />
                                                Estado:
                                                {{
                                                    getStatus(item).description
                                                }}
                                                <br />

                                                <div class="text-center">
                                                    <v-menu location="start">
                                                        <template
                                                            v-slot:activator="{
                                                                props,
                                                            }"
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
                                                                    menuItem,
                                                                    index
                                                                ) in getMenuItems(
                                                                    item
                                                                )"
                                                                :key="index"
                                                                :value="index"
                                                                @click="
                                                                    menuItem.action
                                                                "
                                                            >
                                                                <v-list-item-title
                                                                    >{{
                                                                        menuItem.title
                                                                    }}</v-list-item-title
                                                                >
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
                        <router-link
                            to="/vehicles/create"
                            class="no-link pa-10 text-grey"
                            v-else
                        >
                            <div class="text-center">
                                <v-icon
                                    size="200"
                                    icon="mdi-car-off"
                                    color="grey"
                                />
                                <h3 class="">
                                    Click para Registrar un Nuevo Vehículo
                                </h3>
                            </div>
                        </router-link>
                    </v-card>
                </v-col>
            </v-row>
            <v-row v-if="vehicles.length > 0">
                <v-col cols="12" md="6">
                    <v-pagination
                        :length="pages"
                        v-on:update:model-value="(v) => changePage(v)"
                    />
                </v-col>
                <v-col
                    cols="12"
                    md="6"
                    class="d-flex justify-end items-center mx-auto h-100"
                >
                    Total: {{ total }}
                </v-col>
            </v-row>
        </v-container>
    </div>

    <v-dialog v-model="isActiveModal" max-width="800">
        <template v-slot:default>
            <v-card>
                <v-card-title>
                    {{ modalTitle }}
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
                        <v-autocomplete
                            v-if="blockMapFunctions"
                            :items="statusOptions"
                            v-model="newStatusRoute"
                            item-title="name"
                            item-value="id"
                            label="Estado"
                            variant="outlined"
                            :return-object="true"
                        />
                        <div class="leaflet-map">
                            <l-map
                                ref="mapRef"
                                v-model:zoom="zoom"
                                v-model:center="center"
                                :useGlobalLeaflet="false"
                                @click="onMapClick"
                                v-if="isActiveModal"
                            >
                                <!-- capa base -->
                                <l-tile-layer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    layer-type="base"
                                    name="Stadia Maps Basemap"
                                />

                                <!-- marcadores -->
                                <l-marker
                                    v-if="fromMarker"
                                    :lat-lng="fromMarker"
                                    :draggable="!blockMapFunctions"
                                    @dragstart="disableMapDragging"
                                    @dragend="enableMapDragging"
                                    @moveend="onFromMarkerMoved"
                                />

                                <l-marker
                                    v-if="toMarker"
                                    :lat-lng="toMarker"
                                    :draggable="!blockMapFunctions"
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
                        <v-btn
                            v-if="!blockMapFunctions"
                            @click="createRoute"
                            color="green"
                        >
                            Crear Ruta
                        </v-btn>
                        <v-btn v-else @click="updateRoute" color="green">
                            Actualizar Estado
                        </v-btn>
                    </div>
                </v-card-actions>
            </v-card>
        </template>
    </v-dialog>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch, type Ref } from "vue";
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
import axios from "axios";
import FullScreenOverlay from "../../components/FullScreenOverlay.vue";
import router from "../../router";

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
const blockMapFunctions = ref(false);
const newStatusRoute = ref<{ id: number; name: string } | null>(null);
const isLoading = ref(false);
const mapRef = ref();
const current = ref(1);
const offset = ref(5);
const pages = ref(0);
const total = ref(0);

const statusOptions: { id: number; name: string }[] = [
    { id: 1, name: "Finalizado" },
    { id: 2, name: "Cancelado" },
    { id: 3, name: "Cancelado por el Usuario" },
];

const modalTitle = computed(() => {
    const label = clickCount.value === 0 ? "Origen" : "Destino";
    const selected = clickCount.value === 0 ? origen.value : destino.value;
    return `${
        selected ? "Click para Modificar" : "Seleccione"
    } el ${label} del Viaje`;
});

function getMenuItems(vehicle: Vehicle) {
    return [
        ...(vehicle.status
            ? [
                  {
                      title: "Gestionar Ruta",
                      action: () => openModal(vehicle),
                  },
              ]
            : []),
        {
            title: "Ver Más",
            action: () =>
                router.push({
                    name: "vehicles-details",
                    params: { id: vehicle._id },
                }),
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

const getStatus = ({ lastRoute, status }: Vehicle) => {
    if (!status) {
        return { description: "En Mantenimiento", color: "bg-grey" };
    }
    if (lastRoute?.status === STATUSES.ACTIVE) {
        return { description: "En Servicio", color: "bg-red" };
    }
    return { description: "Disponible", color: "bg-green" };
};

async function getAddressFromLatLng(lat: number, lon: number): Promise<string> {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`;

    try {
        const response = await axios.get(url);
        const { data } = response;
        return data.display_name || "Dirección no encontrada";
    } catch (error) {
        console.error("Error al obtener la dirección:", error);
        return "Error al obtener la dirección";
    }
}

function changePage(value: number) {
    current.value = value;
    getVehicles();
}

async function getVehicles() {
    isLoading.value = true;

    try {
        const { data, pagination } = await vehicleStore.fetchVehicles({
            page: current.value,
            limit: offset.value,
        });

        if (!data) {
            showToast({
                message: "No se encontraron vehículos.",
                icon: "error",
            });
            return;
        }

        vehicles.value = data;
        pages.value = pagination.totalPages;
        total.value = pagination.total;
    } catch (error) {
        showToast({ message: vehicleStore.error, icon: "error" });
        console.error("Error al obtener usuarios:", error);
    } finally {
        isLoading.value = false;
    }
}

async function openModal(vehicle: Vehicle) {
    isLoading.value = true;

    newStatusRoute.value = null;
    const { lastRoute } = vehicle;
    if (lastRoute && lastRoute.status === STATUSES.ACTIVE) {
        blockMapFunctions.value = true;
        const fromLatLngTuple: [number, number] = [
            lastRoute.from.lat,
            lastRoute.from.lon,
        ];
        const toLatLngTuple: [number, number] = [
            lastRoute.to.lat,
            lastRoute.to.lon,
        ];

        origen.value = lastRoute?.from_address;
        destino.value = lastRoute?.to_address;

        fromMarker.value = fromLatLngTuple;
        toMarker.value = toLatLngTuple;

        const midLat = (lastRoute.from.lat + lastRoute.to.lat) / 2;
        const midLon = (lastRoute.from.lon + lastRoute.to.lon) / 2;
        center.value = [midLat, midLon];

        zoom.value = 13;
    } else {
        zoom.value = 17;
        getCurrentLocation();
        blockMapFunctions.value = false;
        setTimeout(() => {
            cleanMap();
        }, 100);
    }

    activeVehicle.value = vehicle._id;
    isActiveModal.value = true;

    isLoading.value = false;
}

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

async function onMapClick(e: L.LeafletMouseEvent) {
    const { latlng } = e;

    if (clickCount.value === 0) {
        fromMarker.value = [latlng.lat, latlng.lng];
        fromLatLng.value = L.latLng(latlng.lat, latlng.lng);
        clickCount.value = 1;
        await setAddress(origen, latlng.lat, latlng.lng);
    } else {
        toMarker.value = [latlng.lat, latlng.lng];
        toLatLng.value = L.latLng(latlng.lat, latlng.lng);
        clickCount.value = 0;
        await setAddress(destino, latlng.lat, latlng.lng);
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
    if (
        !activeVehicle?.value ||
        !fromLatLng.value ||
        !toLatLng.value ||
        !origen
    )
        return;

    const vehicleId = activeVehicle?.value;

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
    })
        .then(async (result) => {
            if (result.isConfirmed) {
                isLoading.value = true;
                try {
                    const route = await routeStore.createRoute({
                        from,
                        to,
                        from_address: origen.value,
                        to_address: destino.value,
                        status: STATUSES.ACTIVE,
                        vehicle_id: vehicleId,
                    });

                    const vehicle = vehicles.value.find(
                        (v) => v._id === activeVehicle.value
                    );

                    if (vehicle) {
                        vehicle.lastRoute = route;
                    }

                    activeVehicle.value = null;
                } catch (err) {
                    showToast({
                        message:
                            routeStore.error || "Error al registrar vehículo.",
                        icon: "error",
                    });
                }
            } else {
                isActiveModal.value = true;
            }
        })
        .finally(() => (isLoading.value = false));
}

async function setAddress(refToUpdate: Ref<string>, lat: number, lon: number) {
    const address = await getAddressFromLatLng(lat, lon);
    refToUpdate.value = address;
}

async function updateRoute() {
    const vehicleId = activeVehicle.value;
    const vehicle = vehicles.value.find((v) => v._id === activeVehicle.value);
    const routeId = vehicle?.lastRoute?._id;
    const routeNewStatusData = newStatusRoute.value;
    if (!vehicleId || !vehicle || !routeId || !routeNewStatusData) return;

    isActiveModal.value = false;

    Swal.fire({
        title: "¿Seguro que desea cambiar el estado?",
        text: "Verifique que los datos antes de hacer el cambio.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#4CAF50",
        cancelButtonColor: "#BDBDBD",
        confirmButtonText: "Aceptar",
        cancelButtonText: "Cancelar",
    })
        .then(async (result) => {
            if (result.isConfirmed) {
                isLoading.value = true;
                try {
                    const route = await routeStore.updateStatusRoute({
                        id: routeId,
                        status: routeNewStatusData.id,
                    });

                    console.log(route);

                    if (vehicle) {
                        vehicle.lastRoute = route;
                    }

                    activeVehicle.value = null;
                    newStatusRoute.value = null;
                } catch (err) {
                    showToast({
                        message:
                            routeStore.error || "Error Actualizando el estado",
                        icon: "error",
                    });
                }
            } else {
                isActiveModal.value = true;
            }
        })
        .finally(() => (isLoading.value = false));
}

onMounted(() => {
    getVehicles();
    getCurrentLocation();

    if (typeof message === "string") {
        showToast({ message, icon: "success" });
    }
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

.no-link {
    text-decoration: none; /* Quita el subrayado del enlace */
    color: inherit; /* Mantiene el color del texto sin cambiarlo */
}
</style>
