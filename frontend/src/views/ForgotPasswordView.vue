<template>
    <div class="d-flex align-center justify-center">
        <v-stepper
            v-model="step"
            :items="['Verificar correo', 'Responder pregunta secreta']"
            hide-actions
            width="600"
        >
            <!-- Paso 1: Enviar email -->
            <template v-slot:item.1>
                <v-card title="Ingresa tu correo electrónico" flat>
                    <v-card-text>
                        <v-form @submit.prevent="fetchSecretQuestion">
                            <v-text-field
                                v-model="form.email"
                                label="Correo electrónico"
                                type="email"
                                required
                                :rules="formRules.email"
                                variant="outlined"
                                class="mb-4"
                            />
                            <v-btn type="submit" color="primary"
                                >Consultar</v-btn
                            >
                        </v-form>
                    </v-card-text>
                </v-card>
            </template>

            <!-- Paso 2: Mostrar pregunta y solicitar respuesta -->
            <template v-slot:item.2>
                <v-card title="Responde tu pregunta secreta" flat>
                    <v-card-text>
                        <v-form @submit.prevent="submitSecretAnswer">
                            <v-text-field
                                v-model="form.secretQuestion"
                                label="Pregunta secreta"
                                readonly
                                variant="outlined"
                            />
                            <v-text-field
                                :rules="formRules.answer"
                                v-model="form.secretAnswer"
                                label="Tu respuesta"
                                required
                                variant="outlined"
                            />
                            <v-text-field
                                :rules="formRules.password"
                                v-model="form.newPassword"
                                label="Nueva Contraseña"
                                required
                                type="password"
                                variant="outlined"
                                class="mb-4"
                            />
                            <v-btn
                                type="button"
                                color="primary"
                                @click="step = 1"
                                class="mr-1"
                                variant="tonal"
                                >Volver</v-btn
                            >
                            <v-btn type="submit" color="primary"
                                >Restaurar</v-btn
                            >
                        </v-form>
                    </v-card-text>
                </v-card>
            </template>
        </v-stepper>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "../stores/auth";
import router from "../router";
import { email, inputRequired, password } from "../constants/formRules";
import { ShowToast } from "../utils/notification";

const auth = useAuthStore();
const error = ref("");
const step = ref(1);
const form = ref({
    email: "",
    secretQuestion: "",
    secretAnswer: "",
    newPassword: "",
});

const formRules = {
    email: email,
    answer: [inputRequired],
    password: password,
};

const fetchSecretQuestion = async () => {
    try {
        const question = await auth.getSecretQuestion(form.value);
        if (!question) {
            error.value =
                "Error al obtener la pregunta secreta. Por favor, verifica tu correo.";
            ShowToast({ message: error.value, icon: "error" });
            return;
        }

        form.value.secretQuestion = question;
        step.value = 2;
    } catch (err) {
        console.error("Error obteniendo la pregunta secreta", err);
        error.value = "Error al obtener la pregunta secreta.";
        ShowToast({ message: error.value, icon: "error" });
    }
};

const submitSecretAnswer = async () => {
    error.value = "";
    try {
        const reset = await auth.resetPassword(form.value);

        if (reset)
            return router.push({
                path: "/login",
                query: { msg: "Contraseña restablecida correctamente" },
            });

        error.value =
            "Error al modificar la contraseña, verifica tu respuesta.";
        ShowToast({ message: error.value, icon: "error" });
    } catch (err) {
        console.error("Respuesta incorrecta o error en la verificación", err);
        error.value = auth.error || "Error al modificar la contraseña.";
        ShowToast({ message: error.value, icon: "error" });
    }
};
</script>

<style></style>
