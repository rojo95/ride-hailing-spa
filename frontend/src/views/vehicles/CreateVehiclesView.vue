<template>
    <FullScreenOverlay :modelValue="isLoading" />
    <div class="py-3 py-md-10 px-md-10">
        <v-container>
            <v-row justify="center">
                <v-col cols="12" md="10">
                    <v-stepper
                        v-model="step"
                        :items="['Conductor', 'Vehículo']"
                        hide-actions
                    >
                        <template v-slot:item.1>
                            <v-card class="ma-auto pa-5">
                                <v-card-title> Conductor </v-card-title>
                                <v-form
                                    ref="driverForm"
                                    @submit.prevent="concreteDriver"
                                >
                                    <v-container>
                                        <v-row>
                                            <v-col
                                                cols="12"
                                                md="6"
                                                align-self="center"
                                            >
                                                <label for="file">
                                                    <v-avatar
                                                        size="300"
                                                        class="mr-md-2 mx-auto rounded-lg my-10 bg-grey-lighten-2"
                                                    >
                                                        <v-img
                                                            :src="avatarUrl"
                                                            alt="Avatar"
                                                            width="100%"
                                                            height="100%"
                                                            cover
                                                            v-if="avatarUrl"
                                                        />
                                                        <v-img
                                                            v-else
                                                            alt="Avatar"
                                                            width="100%"
                                                            height="100%"
                                                            cover
                                                            src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
                                                        />
                                                    </v-avatar>
                                                </label>
                                            </v-col>
                                            <v-col cols="12" md="6">
                                                <v-file-input
                                                    id="file"
                                                    label="Foto"
                                                    variant="outlined"
                                                    required
                                                    accept="image/*"
                                                    :model-value="
                                                        formDriver.avatar
                                                    "
                                                    @update:model-value="
                                                        (file) =>
                                                            updateImage({
                                                                file,
                                                                field: 'avatar',
                                                            })
                                                    "
                                                >
                                                    <template
                                                        #selection="{
                                                            fileNames,
                                                        }"
                                                    >
                                                        <span
                                                            class="text-truncate d-inline-block"
                                                            style="
                                                                max-width: 100%;
                                                                overflow: hidden;
                                                                text-overflow: ellipsis;
                                                                white-space: nowrap;
                                                            "
                                                        >
                                                            {{ fileNames[0] }}
                                                        </span>
                                                    </template>
                                                </v-file-input>
                                                <v-text-field
                                                    prepend-icon="mdi-card-account-details-outline"
                                                    v-model="formDriver.idCard"
                                                    label="Cédula"
                                                    type="text"
                                                    required
                                                    :rules="formRules.idCard"
                                                    variant="outlined"
                                                    class="mb-4"
                                                    @input="
                                                        formDriver.idCard =
                                                            formDriver.idCard.toUpperCase()
                                                    "
                                                />
                                                <v-row>
                                                    <v-col cols="6">
                                                        <v-text-field
                                                            prepend-icon="mdi-account"
                                                            v-model="
                                                                formDriver.name
                                                            "
                                                            label="Nombre"
                                                            type="text"
                                                            required
                                                            :rules="
                                                                formRules.name
                                                            "
                                                            variant="outlined"
                                                            class="mb-4"
                                                            @input="
                                                                formDriver.name =
                                                                    capitalizeWords(
                                                                        formDriver.name
                                                                    )
                                                            "
                                                        />
                                                    </v-col>
                                                    <v-col cols="6">
                                                        <v-text-field
                                                            v-model="
                                                                formDriver.lastname
                                                            "
                                                            label="Apellido"
                                                            type="text"
                                                            required
                                                            :rules="
                                                                formRules.lastname
                                                            "
                                                            variant="outlined"
                                                            class="mb-4"
                                                            @input="
                                                                formDriver.lastname =
                                                                    capitalizeWords(
                                                                        formDriver.lastname
                                                                    )
                                                            "
                                                        />
                                                    </v-col>
                                                </v-row>

                                                <v-text-field
                                                    prepend-icon="mdi-email"
                                                    v-model="formDriver.email"
                                                    label="Correo electrónico"
                                                    type="email"
                                                    required
                                                    :rules="formRules.email"
                                                    variant="outlined"
                                                    class="mb-4"
                                                    @input="
                                                        formDriver.email =
                                                            formDriver.email.toLowerCase()
                                                    "
                                                />

                                                <v-text-field
                                                    prepend-icon="mdi-phone"
                                                    v-model="formDriver.phone"
                                                    label="Teléfono"
                                                    type="tel"
                                                    required
                                                    :rules="formRules.phone"
                                                    variant="outlined"
                                                    class="mb-4"
                                                />

                                                <v-date-input
                                                    label="Fecha de Expiración de Licencia"
                                                    variant="outlined"
                                                    v-model="
                                                        formDriver.licenseExpiry
                                                    "
                                                    required
                                                    :rules="
                                                        formRules.licenseExpiry
                                                    "
                                                    class="mb-4"
                                                    :min="todayString"
                                                    append-inner-icon="mdi-user"
                                                    :display-format="
                                                        displayFormat
                                                    "
                                                    placeholder=""
                                                />
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col>
                                                <v-btn
                                                    type="submit"
                                                    color="primary"
                                                    :disabled="!isFormValid"
                                                >
                                                    Siguiente
                                                </v-btn>
                                            </v-col>
                                        </v-row>
                                    </v-container>
                                </v-form>
                            </v-card>
                        </template>

                        <template v-slot:item.2>
                            <v-card class="ma-auto pa-5">
                                <v-card-title> Conductor </v-card-title>
                                <v-form
                                    ref="driverForm"
                                    @submit.prevent="
                                        vehicleId
                                            ? updateVehicle()
                                            : registerVehicle()
                                    "
                                >
                                    <v-container>
                                        <v-row>
                                            <v-col
                                                cols="12"
                                                md="6"
                                                align-self="center"
                                            >
                                                <label for="fileCar">
                                                    <v-avatar
                                                        size="300"
                                                        class="mr-md-2 mx-auto rounded-lg my-10 bg-grey-lighten-2"
                                                    >
                                                        <v-img
                                                            :src="photoCarUrl"
                                                            alt="Avatar"
                                                            width="100%"
                                                            height="100%"
                                                            cover
                                                            v-if="photoCarUrl"
                                                        />
                                                        <v-img
                                                            v-else
                                                            src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
                                                        />
                                                    </v-avatar>
                                                </label>
                                            </v-col>
                                            <v-col cols="12" md="6">
                                                <v-file-input
                                                    id="fileCar"
                                                    label="Foto"
                                                    variant="outlined"
                                                    required
                                                    accept="image/*"
                                                    :model-value="
                                                        formVehicle.picture
                                                    "
                                                    @update:model-value="
                                                        (file) =>
                                                            updateImage({
                                                                file,
                                                                field: 'vehicle',
                                                            })
                                                    "
                                                />

                                                <v-text-field
                                                    prepend-icon="mdi-card-bulleted-outline"
                                                    v-model="formVehicle.plate"
                                                    label="Placa"
                                                    type="text"
                                                    required
                                                    :rules="formRules.plate"
                                                    variant="outlined"
                                                    class="mb-4"
                                                    @input="
                                                        formVehicle.plate =
                                                            formVehicle.plate.toUpperCase()
                                                    "
                                                />

                                                <v-autocomplete
                                                    label="Año"
                                                    variant="outlined"
                                                    v-model="formVehicle.year"
                                                    :items="yearsList"
                                                    clearable
                                                    prepend-icon="mdi-calendar-range"
                                                />

                                                <v-autocomplete
                                                    label="Marca"
                                                    variant="outlined"
                                                    v-model="
                                                        formVehicle.brand_id
                                                    "
                                                    :items="carBrands"
                                                    item-title="name"
                                                    item-value="_id"
                                                    :return-object="false"
                                                    clearable
                                                    prepend-icon="mdi-copyright"
                                                />

                                                <v-autocomplete
                                                    v-model="
                                                        formVehicle.model_id
                                                    "
                                                    :items="availableModels"
                                                    item-title="name"
                                                    item-value="_id"
                                                    label="Modelo"
                                                    variant="outlined"
                                                    :disabled="
                                                        !availableModels.length
                                                    "
                                                    :return-object="false"
                                                    clearable
                                                    prepend-icon="mdi-copyright"
                                                />

                                                <v-text-field
                                                    prepend-icon="mdi-palette"
                                                    v-model="formVehicle.color"
                                                    label="Color"
                                                    type="text"
                                                    required
                                                    :rules="formRules.color"
                                                    variant="outlined"
                                                    class="mb-4"
                                                    @input="
                                                        formVehicle.color =
                                                            formVehicle.color.toUpperCase()
                                                    "
                                                />

                                                <v-text-field
                                                    prepend-icon="mdi-account-group"
                                                    v-model="
                                                        formVehicle.capacity
                                                    "
                                                    label="Capacidad"
                                                    type="number"
                                                    required
                                                    :rules="formRules.capacity"
                                                    variant="outlined"
                                                    class="mb-4"
                                                    :min="2"
                                                    :max="9"
                                                />

                                                <v-autocomplete
                                                    label="Estado inicial del vehículo"
                                                    variant="outlined"
                                                    v-model="formVehicle.status"
                                                    :items="carStatuses"
                                                    item-title="description"
                                                    item-value="id"
                                                    :return-object="false"
                                                    prepend-icon="mdi-room-service-outline"
                                                />
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col cols="6" md="6">
                                                <v-btn
                                                    type="button"
                                                    color="primary"
                                                    @click="step = 1"
                                                    variant="tonal"
                                                >
                                                    Atrás
                                                </v-btn>
                                            </v-col>
                                            <v-col cols="6" md="6">
                                                <v-btn
                                                    type="submit"
                                                    color="green"
                                                    :disabled="
                                                        !isFormVehicleValid
                                                    "
                                                    >{{
                                                        !vehicleId
                                                            ? "Crear"
                                                            : "Actualizar"
                                                    }}</v-btn
                                                >
                                            </v-col>
                                        </v-row>
                                    </v-container>
                                </v-form>
                            </v-card>
                        </template>
                    </v-stepper>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script setup lang="ts">
import {
    email,
    idCard,
    inputRequired,
    maxValue,
    minValue,
    ONLY_TEXT_PATTERN,
    onlyNumber,
    onlyText,
    PHONE_NUMBER_PATTERN,
    type RuleStringValue,
} from "../../constants/formRules";
import { computed, onMounted, reactive, ref, watch } from "vue";
import { capitalizeWords } from "../../utils/text";
import type { DriverForm } from "../../types/driver";
import { useVehicleStore } from "../../stores/vehicles";
import type { CarBrandResponse } from "../../types/carBrand";
import type { VehicleForm } from "../../types/vehicle";
import router from "../../router";
import { ConfirmAction, ShowToast } from "../../utils/notification";
import { carStatuses, STATUSES } from "../../constants/vehicle";
import { useRoute } from "vue-router";
import FullScreenOverlay from "../../components/FullScreenOverlay.vue";

const isLoading = ref(false);
const vehicleStore = useVehicleStore();
const route = useRoute();
const vehicleId = route.query.vehicleId;
const step = ref(1);
const today = new Date();
today.setHours(0, 0, 0, 0);
const todayString = today.toISOString().split("T")[0];
const avatarUrl = ref<string | null>(null);
const photoCarUrl = ref<string | null>(null);
const yearsCount = 40;
let yearsList: number[] = [];
const carBrands = ref<CarBrandResponse[]>([]);
const avatarIsRequired = ref(true);
const pictureIsRequired = ref(true);

const displayFormat = (date: string | Date) => {
    const d = typeof date === "string" ? new Date(date) : date;
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
};

const availableModels = computed(() => {
    const brand = carBrands.value.find((b) => b._id === formVehicle.brand_id);
    return brand ? brand.models : [];
});

const isFormValid = computed(() => {
    const licenseDate =
        typeof formDriver.licenseExpiry === "string"
            ? formDriver.licenseExpiry
            : formDriver.licenseExpiry?.toISOString().split("T")[0];

    const avatarValid = avatarIsRequired.value
        ? formDriver.avatar !== null
        : true;

    return (
        avatarValid &&
        formDriver.idCard !== "" &&
        formDriver.name !== "" &&
        formDriver.lastname !== "" &&
        formDriver.email !== "" &&
        formDriver.phone !== "" &&
        licenseDate >= todayString
    );
});

const isFormVehicleValid = computed(() => {
    const pictureValid = pictureIsRequired.value
        ? formVehicle.picture !== null
        : true;

    return (
        formVehicle.plate !== "" &&
        formVehicle.brand_id !== "" &&
        formVehicle.brand_id !== null &&
        formVehicle.model_id !== "" &&
        formVehicle.model_id !== null &&
        formVehicle.year !== null &&
        formVehicle.color !== "" &&
        formVehicle.capacity !== null &&
        formVehicle.capacity > 1 &&
        formVehicle.capacity < 10 &&
        pictureValid &&
        ONLY_TEXT_PATTERN.test(formVehicle.color) &&
        formVehicle.status
    );
});

const formDriver = reactive<DriverForm>({
    idCard: "",
    name: "",
    lastname: "",
    avatar: null,
    licenseExpiry: "",
    email: "",
    phone: "",
});

const formVehicle = reactive<VehicleForm>({
    plate: "",
    brand_id: null,
    model_id: null,
    year: null,
    color: "",
    capacity: null,
    picture: null,
    status: null,
});

const formRules = {
    idCard: [inputRequired, idCard],
    name: [onlyText, inputRequired],
    lastname: [onlyText, inputRequired],
    licenseExpiry: [inputRequired],
    plate: [inputRequired],
    color: [inputRequired, onlyText],
    capacity: [
        inputRequired,
        onlyNumber,
        (v: RuleStringValue) => minValue(v, 2),
        (v: RuleStringValue) => maxValue(v, 9),
    ],
    email: email,
    phone: [
        inputRequired,
        (v: RuleStringValue) =>
            !v ||
            PHONE_NUMBER_PATTERN.test(v) ||
            "Número de teléfono no válido",
    ],
};

const updateImage = ({
    file,
    field,
}: {
    file: File | File[];
    field: string;
}) => {
    if (!file) {
        if (field === "avatar") {
            avatarUrl.value = null;
            formDriver.avatar = null;
        } else {
            photoCarUrl.value = null;
            formVehicle.picture = null;
        }
        return;
    }

    let selectedFile: File | null = null;

    if (Array.isArray(file)) {
        selectedFile = file.length > 0 ? file[0] : null;
    } else {
        selectedFile = file;
    }

    if (field === "avatar") {
        formDriver.avatar = selectedFile;
        avatarIsRequired.value = true;
    } else {
        formVehicle.picture = selectedFile;
        pictureIsRequired.value = true;
    }

    if (selectedFile) {
        const reader = new FileReader();
        reader.onload = (event: ProgressEvent<FileReader>) => {
            const result = event.target?.result;
            if (typeof result === "string") {
                if (field === "avatar") {
                    avatarUrl.value = result;
                } else {
                    photoCarUrl.value = result;
                }
            }
        };
        reader.readAsDataURL(selectedFile);
    } else {
        if (field === "avatar") {
            avatarUrl.value = null;
        } else {
            photoCarUrl.value = null;
        }
    }
};

function concreteDriver() {
    step.value = 2;
}

function generateYearsList(yearsCount: number) {
    const currentYear = new Date().getFullYear(); // Obtiene el año actual
    const yearsList = [];
    for (let i = 0; i < yearsCount; i++) {
        yearsList.push(currentYear + 1 - i); // Añade el año siguiente y luego los anteriores
    }
    return yearsList;
}

async function getCarBrands() {
    try {
        const data = await vehicleStore.fetchCarBrand();
        if (!data) return;

        carBrands.value = data;
    } catch (error) {
        ShowToast({ message: vehicleStore.error, icon: "error" });
        console.error("Error al obtener usuarios:", error);
    }
}

async function registerVehicle() {
    if (!isFormVehicleValid || !isFormValid) return;

    try {
        await ConfirmAction({
            title: "¿Seguro que desea registrar los datos?",
            text: `Verifique que los datos tanto del conductor como del vehículo sean correctos${
                formVehicle.status === STATUSES.IN_SERVICE
                    ? "; recuerde asignar una ruta al vehículo en la pantalla principal"
                    : ""
            }.`,
            onConfirm: async () => {
                const response = await vehicleStore.createVehicle({
                    driver: formDriver,
                    vehicle: formVehicle,
                });

                if (response?.driver && response?.vehicle) {
                    router.push({
                        path: "/vehicles",
                        query: { msg: "Vehículo registrado de manera exitosa" },
                    });
                }
            },
        });
    } catch (error) {
        ShowToast({
            message: vehicleStore.error || "Error al registrar vehículo.",
            icon: "error",
        });
    }
}

async function getVehicleData() {
    if (!vehicleId || typeof vehicleId !== "string") return;
    isLoading.value = true;
    avatarIsRequired.value = false;
    pictureIsRequired.value = false;

    try {
        const vehicle = await vehicleStore.getVehicleById(vehicleId);

        // Asignar los datos del conductor
        formDriver.idCard = vehicle.driver_id.idCard;
        formDriver.name = vehicle.driver_id.name;
        formDriver.lastname = vehicle.driver_id.lastname;
        // formDriver.avatar = vehicle.driver_id.;
        avatarUrl.value = vehicle.driver_id.avatar;
        formDriver.licenseExpiry = vehicle.driver_id.licenseExpiry;
        formDriver.email = vehicle.driver_id.email;
        formDriver.phone = vehicle.driver_id.phone;

        // Asignar los datos del vehículo
        formVehicle.plate = vehicle.plate;
        formVehicle.brand_id = vehicle.model_id.brand_id._id;
        formVehicle.year = new Date(vehicle.year).getFullYear();
        formVehicle.color = vehicle.color;
        formVehicle.capacity = vehicle.capacity;
        // formVehicle.picture = vehicle.picture;
        photoCarUrl.value = vehicle.picture;
        formVehicle.status = vehicle.status;

        // Asignar el model_id basado en la marca ya asignada
        const brand = carBrands.value.find(
            (b) => b._id === formVehicle.brand_id
        );
        if (brand) {
            // Asignar el model_id si existe en la lista de modelos de la marca
            const model = brand.models.find(
                (model) => model._id === vehicle.model_id._id
            );
            formVehicle.model_id = model ? model._id : null; // Asignar el model_id o null si no se encuentra
        }

        if (!vehicle)
            return ShowToast({
                message: "No se ha conseguido la información del vehículo",
                icon: "error",
            });
    } catch (error) {
        ShowToast({ message: vehicleStore.error, icon: "error" });
    } finally {
        isLoading.value = false;
    }
}

watch(
    () => formVehicle.brand_id,
    (newBrandId) => {
        const brand = carBrands.value.find((b) => b._id === newBrandId);
        if (brand) {
            // Si hay un modelo preseleccionado que no está en la nueva lista de modelos, lo reseteamos
            const modelExists = brand.models.some(
                (model) => model._id === formVehicle.model_id
            );
            if (!modelExists) {
                formVehicle.model_id = null; // Reseteamos el model_id si no existe en la nueva lista
            }
        } else {
            formVehicle.model_id = null; // Reseteamos si no hay marca
        }
    }
);

async function updateVehicle() {
    if (!isFormVehicleValid || !isFormValid || typeof vehicleId !== "string")
        return;

    try {
        await ConfirmAction({
            title: "¿Seguro que desea actualizar los datos?",
            text: `Verifique que los datos tanto del conductor como del vehículo sean correctos.`,
            onConfirm: async () => {
                isLoading.value = true;
                const response = await vehicleStore.updateVehicle({
                    vehicleId,
                    driver: formDriver,
                    vehicle: formVehicle,
                });

                if (response?.driver && response?.vehicle) {
                    router.push({
                        path: "/vehicles/" + response.vehicle._id,
                        query: {
                            msg: "Vehículo actualizado de manera exitosa",
                        },
                    });
                }
            },
        });
    } catch (error) {
        ShowToast({
            message: vehicleStore.error || "Error al registrar vehículo.",
            icon: "error",
        });
    } finally {
        isLoading.value = false;
    }
}

onMounted(() => {
    yearsList = generateYearsList(yearsCount);
    getCarBrands();

    if (vehicleId) {
        getVehicleData();
    }
});
</script>
