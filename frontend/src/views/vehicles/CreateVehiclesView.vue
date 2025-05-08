<template>
    <div class="pa-10 d-flex justify-center">
        <v-stepper
            v-model="step"
            :items="['Conductor', 'Vehículo']"
            hide-actions
            :width="800"
        >
            <template v-slot:item.1>
                <v-card class="ma-auto pa-5">
                    <v-card-title> Conductor </v-card-title>
                    <v-form ref="driverForm" @submit.prevent="concreteDriver">
                        <div class="d-md-flex g-4 mb-4 px-auto align-center">
                            <div class="d-flex justify-center">
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
                            </div>
                            <div class="w-100 ps-5 form">
                                <v-file-input
                                    id="file"
                                    label="Foto"
                                    variant="outlined"
                                    required
                                    accept="image/*"
                                    :model-value="formDriver.avatar"
                                    @update:model-value="
                                        (file) =>
                                            updateImage({
                                                file,
                                                field: 'avatar',
                                            })
                                    "
                                >
                                    <template #selection="{ fileNames }">
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
                                <div class="d-flex flex-wrap ga-4">
                                    <v-text-field
                                        prepend-icon="mdi-account"
                                        v-model="formDriver.name"
                                        label="Nombre"
                                        type="text"
                                        required
                                        :rules="formRules.name"
                                        variant="outlined"
                                        class="mb-4"
                                        @input="
                                            formDriver.name = capitalizeWords(
                                                formDriver.name
                                            )
                                        "
                                    />
                                    <v-text-field
                                        v-model="formDriver.lastname"
                                        label="Apellido"
                                        type="text"
                                        required
                                        :rules="formRules.lastname"
                                        variant="outlined"
                                        class="mb-4"
                                        @input="
                                            formDriver.lastname =
                                                capitalizeWords(
                                                    formDriver.lastname
                                                )
                                        "
                                    />
                                </div>

                                <v-date-input
                                    label="Fecha de Expiración de Licencia"
                                    variant="outlined"
                                    v-model="formDriver.licenseExpiry"
                                    required
                                    :rules="formRules.licenseExpiry"
                                    class="mb-4"
                                    :min="todayString"
                                    append-inner-icon="mdi-user"
                                    :display-format="displayFormat"
                                    placeholder=""
                                />
                            </div>
                        </div>

                        <v-btn
                            type="submit"
                            color="primary"
                            :disabled="!isFormValid"
                        >
                            Siguiente
                        </v-btn>
                    </v-form>
                </v-card>
            </template>

            <template v-slot:item.2>
                <v-card class="ma-auto pa-5">
                    <v-card-title> Conductor </v-card-title>
                    <v-form ref="driverForm" @submit.prevent="registerVehicle">
                        <div class="d-md-flex g-4 mb-4 align-center">
                            <div class="d-flex justify-center">
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
                            </div>
                            <div class="w-100 ps-5">
                                <v-file-input
                                    id="fileCar"
                                    label="Foto"
                                    variant="outlined"
                                    required
                                    accept="image/*"
                                    :model-value="formVehicle.picture"
                                    @update:model-value="
                                        (file) =>
                                            updateImage({
                                                file,
                                                field: 'ºvehicle',
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
                                    v-model="formVehicle.brand_id"
                                    :items="carBrands"
                                    item-title="name"
                                    item-value="_id"
                                    :return-object="false"
                                    clearable
                                    prepend-icon="mdi-copyright"
                                />

                                <v-autocomplete
                                    v-model="formVehicle.model_id"
                                    :items="availableModels"
                                    item-title="name"
                                    item-value="_id"
                                    label="Modelo"
                                    variant="outlined"
                                    :disabled="!availableModels.length"
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
                                    v-model="formVehicle.capacity"
                                    label="Capacidad"
                                    type="number"
                                    required
                                    :rules="formRules.capacity"
                                    variant="outlined"
                                    class="mb-4"
                                    :min="2"
                                    :max="9"
                                />
                            </div>
                        </div>

                        <div class="w-100 d-flex justify-space-between">
                            <v-btn
                                type="button"
                                color="primary"
                                @click="step = 1"
                                variant="tonal"
                            >
                                Atrás
                            </v-btn>
                            <v-btn
                                type="submit"
                                color="green"
                                :disabled="!isFormVehicleValid"
                                >Crear</v-btn
                            >
                        </div>
                    </v-form>
                </v-card>
            </template>
        </v-stepper>
        <v-alert v-if="error" type="error" class="message-toast">
            {{ error }}
        </v-alert>
    </div>
</template>

<script setup lang="ts">
import {
    idCard,
    inputRequired,
    maxValue,
    minValue,
    ONLY_TEXT_PATTERN,
    onlyNumber,
    onlyText,
    type RuleStringValue,
} from "../../constants/formRules";
import { computed, onMounted, reactive, ref } from "vue";
import { capitalizeWords } from "../../utils/text";
import type { DriverForm } from "../../types/driver";
import { useVehicleStore } from "../../stores/vehicles";
import type { CarBrandResponse } from "../../types/carBrand";
import type { VehicleForm } from "../../types/vehicle";
import router from "../../router";
import Swal from "sweetalert2";

const vehicleStore = useVehicleStore();
const error = ref("");
const step = ref(1);
const today = new Date();
today.setHours(0, 0, 0, 0);
const todayString = today.toISOString().split("T")[0];
const avatarUrl = ref<string | null>(null);
const photoCarUrl = ref<string | null>(null);
const yearsCount = 40;
let yearsList: number[] = [];
const carBrands = ref<CarBrandResponse[]>([]);

const displayFormat = (date: string | Date) => {
    const d = typeof date === "string" ? new Date(date) : date;
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
};

const availableModels = computed(() => {
    const brand = carBrands.value.find((b) => b._id === formVehicle.brand_id);
    formVehicle.model_id = null;
    return brand ? brand.models : [];
});

const isFormValid = computed(() => {
    const licenseDate =
        typeof formDriver.licenseExpiry === "string"
            ? formDriver.licenseExpiry
            : formDriver.licenseExpiry?.toISOString().split("T")[0];

    return (
        formDriver.avatar !== null &&
        formDriver.idCard !== "" &&
        formDriver.name !== "" &&
        formDriver.lastname !== "" &&
        licenseDate >= todayString
    );
});

const isFormVehicleValid = computed(() => {
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
        formVehicle.picture !== null &&
        ONLY_TEXT_PATTERN.test(formVehicle.color)
    );
});

const formDriver = reactive<DriverForm>({
    idCard: "",
    name: "",
    lastname: "",
    avatar: null,
    licenseExpiry: "",
});

const formVehicle = reactive<VehicleForm>({
    plate: "",
    brand_id: null,
    model_id: null,
    year: null,
    color: "",
    capacity: null,
    picture: null,
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
    } else {
        formVehicle.picture = selectedFile;
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
        console.error("Error al obtener usuarios:", error);
    }
}

async function registerVehicle() {
    error.value = "";
    if (!isFormVehicleValid || !isFormValid) return;

    Swal.fire({
        title: "¿Seguro que desea registrar los datos?",
        text: "Verifique que los datos tanto del conductor como del vehículo sean correctos.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#4CAF50",
        cancelButtonColor: "#BDBDBD",
        confirmButtonText: "Aceptar",
        cancelButtonText: "Cancelar",
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const response = await vehicleStore.createVehicle({
                    driver: formDriver,
                    vehicle: formVehicle,
                });
                if (response && response.driver && response.vehicle)
                    return router.push({
                        path: "/vehicles",
                        query: { msg: "Vehículo registrado de manera exitosa" },
                    });
            } catch (err) {
                error.value =
                    vehicleStore.error || "Error al registrar vehículo.";
            }
        }
    });
}

onMounted(() => {
    yearsList = generateYearsList(yearsCount);
    getCarBrands();
});
</script>

<style lang="scss" scoped>
.form {
    width: 300px;
}

.message-toast {
    position: fixed;
    right: 10px;
    bottom: 10px;
}
</style>
