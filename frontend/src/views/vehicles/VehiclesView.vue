<template>
    <FullScreenOverlay :modelValue="isLoading" />
    <div class="pa-10">
        <v-container>
            <v-row justify="center">
                <v-col cols="12" sm="10">
                    <v-card class="w-100" width="300">
                        <v-card-title class="d-flex">
                            <v-row>
                                <v-col cols="6">
                                    <p>Vehículos</p>
                                </v-col>
                                <v-col class="d-flex justify-end" cols="6">
                                    <v-text-field
                                        prepend-inner-icon="mdi-car-back"
                                        v-model="search"
                                        label="Buscar"
                                        type="text"
                                        required
                                        variant="underlined"
                                        @input="Search"
                                    />
                                    <router-link to="/vehicles/create">
                                        <v-btn
                                            color="green"
                                            variant="elevated"
                                            class="text-white rounded-lg"
                                            height="45"
                                        >
                                            <v-icon color="white"
                                                >mdi-plus</v-icon
                                            >
                                        </v-btn>
                                    </router-link>
                                    <v-menu
                                        location="start"
                                        v-model="menu"
                                        offset-y
                                    >
                                        <template #activator="{ props }">
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
                                            <v-list-item disabled>
                                                <v-list-item-content>
                                                    <v-list-item-title
                                                        >Ordenar
                                                        por</v-list-item-title
                                                    >
                                                </v-list-item-content>
                                            </v-list-item>

                                            <v-list-item
                                                v-for="(
                                                    item, index
                                                ) in ItemsFilter"
                                                :key="index"
                                                :value="index"
                                                @click="changeFilter(item.id)"
                                                class="menu-item"
                                                v-model="filteredBy"
                                                :active="filteredBy === item.id"
                                            >
                                                <v-list-item-content>
                                                    <v-list-item-title>{{
                                                        item.description
                                                    }}</v-list-item-title>
                                                </v-list-item-content>
                                            </v-list-item>
                                        </v-list>
                                    </v-menu>
                                </v-col>
                            </v-row>
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
                                                        }}) -
                                                        {{
                                                            getStatus(
                                                                item.status
                                                            ).description
                                                        }}
                                                    </v-list-item-subtitle>
                                                </div>
                                            </v-list-item-content>

                                            <div
                                                class="rounded-circle me-3"
                                                :class="
                                                    getStatus(item.status).color
                                                "
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
                                                    getStatus(item.status)
                                                        .description
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

    <v-dialog v-model="isActiveModal" max-width="700">
        <template v-if="showStatuses">
            <v-row justify="center" align-content="center">
                <v-col>
                    <v-card>
                        <v-card-title>
                            Cambiar Estado del Vehículo
                        </v-card-title>
                        <v-card-text>
                            <v-autocomplete
                                label="Estado inicial del vehículo"
                                variant="outlined"
                                v-model="newStatus"
                                :items="carStatuses"
                                item-title="description"
                                item-value="id"
                                :return-object="false"
                                prepend-icon="mdi-room-service-outline"
                            />
                            <v-btn
                                type="submit"
                                color="green"
                                @click="updateStatus"
                            >
                                Cambiar Estado
                            </v-btn>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </template>
        <template v-else>
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
import type { Location } from "../../types/location";
import { ConfirmAction, ShowToast } from "../../utils/notification";
import { STATUSES } from "../../constants/routes";
import {
    carStatuses,
    STATUSES as VEHICLE_STATUSES,
} from "../../constants/vehicle";
import axios from "axios";
import FullScreenOverlay from "../../components/FullScreenOverlay.vue";
import router from "../../router";
import { ITEMS_FILTER, ItemsFilter } from "../../constants/filters";

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
const showStatuses = ref(false);
const newStatus = ref<number>(VEHICLE_STATUSES.AVAILABLE);
const search = ref("");
let searchTimeout: ReturnType<typeof setTimeout> | null = null;
const menu = ref(false);
const filteredBy = ref<number>(ITEMS_FILTER.NEW.id);

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

async function Search() {
    // Reiniciar el temporizador si ya existe
    if (searchTimeout) {
        clearTimeout(searchTimeout);
    }

    // Iniciar un nuevo temporizador de 3 segundos
    searchTimeout = setTimeout(() => {
        getVehicles();
    }, 1500);
}

function getMenuItems(vehicle: Vehicle) {
    return [
        ...(vehicle.status !== VEHICLE_STATUSES.MAINTENANCE
            ? [
                  {
                      title: "Gestionar Ruta",
                      action: () => openModal(vehicle),
                  },
              ]
            : []),
        {
            title: "Cambiar estado",
            action: () => openEditStatusModal(vehicle),
        },
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
            action: () =>
                router.push({
                    name: "vehicles-create",
                    query: { vehicleId: vehicle._id },
                }),
        },
        {
            title: "Eliminar",
            action: () => deleteVehicle(vehicle),
        },
    ];
}

function openEditStatusModal(item: Vehicle) {
    isActiveModal.value = true;
    activeVehicle.value = item._id;
    showStatuses.value = true;
    newStatus.value = item.status;
}

async function updateStatus() {
    const vehicle = vehicles.value.find((v) => v._id === activeVehicle.value);
    const actVehicle = activeVehicle.value;

    if (!vehicle || !actVehicle || vehicle.status === newStatus.value) return;

    isActiveModal.value = false;

    try {
        await ConfirmAction({
            title: "¿Desea cambiar el estado?",
            onConfirm: async () => {
                isLoading.value = true;

                const updated = await vehicleStore.updateStatus(
                    actVehicle,
                    newStatus.value
                );
                vehicle.status = updated.status;

                ShowToast({
                    message: "Estado actualizado correctamente.",
                    icon: "success",
                });
                activeVehicle.value = null;
            },
            onCancel: () => {
                isActiveModal.value = true;
                isLoading.value = false;
                newStatus.value = vehicle.status;
            },
        });
    } catch (error) {
        ShowToast({
            message: vehicleStore.error,
            icon: "error",
        });
    } finally {
        isLoading.value = false;
    }
}

const getStatus = (status: number) => {
    switch (status) {
        case VEHICLE_STATUSES.MAINTENANCE:
            return { description: "En Mantenimiento", color: "bg-grey" };

        case VEHICLE_STATUSES.IN_SERVICE:
            return { description: "En Servicio", color: "bg-red" };

        default:
            return { description: "Disponible", color: "bg-green" };
    }
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

function changeFilter(filterId: number) {
    filteredBy.value = filterId;
    getVehicles();
}

async function getVehicles() {
    isLoading.value = true;

    try {
        const { data, pagination } = await vehicleStore.fetchVehicles({
            page: current.value,
            limit: offset.value,
            search: search.value,
            filteredBy: filteredBy.value,
        });

        if (!data) {
            ShowToast({
                message: "No se encontraron vehículos.",
                icon: "error",
            });
            return;
        }

        vehicles.value = data;
        pages.value = pagination.totalPages;
        total.value = pagination.total;
    } catch (error) {
        ShowToast({ message: vehicleStore.error, icon: "error" });
        console.error("Error al obtener usuarios:", error);
    } finally {
        isLoading.value = false;
    }
}

async function openModal(vehicle: Vehicle) {
    isLoading.value = true;
    isActiveModal.value = false;

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

    try {
        await ConfirmAction({
            title: "¿Desea confirmar la ruta?",
            text: 'El estatus del conductor se cambiará a "En Servicio".',
            onConfirm: async () => {
                isLoading.value = true;

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
                    vehicle.status = VEHICLE_STATUSES.IN_SERVICE;
                    vehicle.lastRoute = route;
                }

                activeVehicle.value = null;
                ShowToast({
                    message:
                        'Ruta asignada de manera exitosa, estatus del conductor cambiado a "En Servicio".',
                    icon: "success",
                });
            },
            onCancel: () => {
                isActiveModal.value = true;
            },
        });
    } catch (error) {
        ShowToast({
            message: vehicleStore.error,
            icon: "error",
        });
    } finally {
        isLoading.value = false;
    }
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

    try {
        await ConfirmAction({
            title: "¿Seguro que desea cambiar el estado?",
            text: "Verifique que los datos antes de hacer el cambio.",
            onConfirm: async () => {
                isLoading.value = true;
                const route = await routeStore.updateStatusRoute({
                    id: routeId,
                    status: routeNewStatusData.id,
                });

                if (vehicle) {
                    vehicle.lastRoute = route;
                    vehicle.status = VEHICLE_STATUSES.AVAILABLE;
                }

                activeVehicle.value = null;
                newStatusRoute.value = null;

                ShowToast({
                    message: "Estado actualizado correctamente.",
                    icon: "success",
                });
            },
        });
    } catch (error) {
        ShowToast({
            message: vehicleStore.error,
            icon: "error",
        });
    } finally {
        isLoading.value = false;
    }
}

async function deleteVehicle(vehicle: Vehicle) {
    if (!vehicle) return;

    try {
        await ConfirmAction({
            title: `¿Seguro que desea eliminar el ${
                vehicle.model_id.brand_id.name + " " + vehicle.model_id.name
            } con placa ${vehicle.plate}?`,
            text: `Esta acción no se puede reversar${
                vehicle.lastRoute?.status === STATUSES.ACTIVE
                    ? ", la ruta programada se cancelará"
                    : ""
            }.`,
            onConfirm: async () => {
                isLoading.value = true;
                const response = await vehicleStore.deleteVehicle(vehicle._id);

                ShowToast({ message: response.message, icon: "success" });
            },
        });

        getVehicles();
    } catch (error) {
        ShowToast({
            message: vehicleStore.error,
            icon: "error",
        });
    } finally {
        isLoading.value = false;
    }
}

onMounted(() => {
    getVehicles();
    getCurrentLocation();

    if (typeof message === "string") {
        ShowToast({ message, icon: "success" });
    }
});
</script>

<style>
.leaflet-map {
    height: 300px;
    width: 100%;
}

.no-link {
    text-decoration: none;
    color: inherit;
}
</style>
