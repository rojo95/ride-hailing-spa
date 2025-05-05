<template>
    <v-card class="pa-6" width="400">
        <v-card-title class="text-h5 text-center">Crear Usuario</v-card-title>

        <v-form @submit.prevent="handleForm" v-model="valid">
            <v-text-field
                :rules="formRules.email"
                hide-details="auto"
                v-model="form.email"
                label="Correo electrónico"
                type="email"
                required
                class="mb-3"
                variant="outlined"
            />
            <v-text-field
                :rules="formRules.password"
                v-model="form.password"
                label="Contraseña"
                :type="!showPass ? 'password' : 'text'"
                required
                variant="outlined"
                :append-inner-icon="showPass ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="handleShowPass"
            /><v-text-field
                :rules="formRules.confirmPass"
                v-model="form.confirmPass"
                label="Confirmar Contraseña"
                :type="!showPass ? 'password' : 'text'"
                required
                variant="outlined"
                :append-inner-icon="showPass ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="handleShowPass"
            />
            <v-text-field
                :rules="formRules.text"
                hide-details="auto"
                v-model="form.secretQuestion"
                label="Pregunta Secreta"
                required
                class="mb-3"
                variant="outlined"
            />
            <v-text-field
                :rules="formRules.text"
                hide-details="auto"
                v-model="form.secretAnswer"
                label="Pregunta Secreta"
                required
                class="mb-3"
                variant="outlined"
            />
            <v-btn
                :loading="loading"
                :disabled="!valid"
                type="submit"
                color="primary"
                class="mt-4"
                block
            >
                Registrar
            </v-btn>
        </v-form>

        <v-alert v-if="error" type="error" class="mt-4">{{ error }}</v-alert>
    </v-card>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "../stores/auth";
import { email, password } from "../constants/formRules";

const auth = useAuthStore();
const error = ref<string>("");
const valid = ref<boolean>(false);
const showPass = ref<boolean>(false);
const loading = ref<boolean>(false);

function handleShowPass() {
    showPass.value = !showPass.value;
}

const handleForm = async () => {
    // Limpiar el error antes de intentar iniciar sesión
    error.value = "";

    try {
        // Intentar iniciar sesión y capturar el error
        await auth.registerUser(form.value);
    } catch (err) {
        error.value = auth.error || "Error al registrar usuario.";
    }
};

type RuleValue = string | null;
const formRules = {
    email: email,
    password: password,
    confirmPass: [
        ...password,
        (v: RuleValue) =>
            v === form.value.password || "Las contraseñas no coinciden.",
    ],
    text: [(v: RuleValue) => !!v || "Campo requerido."],
};

const form = ref({
    email: "",
    password: "",
    confirmPass: "",
    secretQuestion: "",
    secretAnswer: "",
});
</script>

<style lang="scss" scoped></style>
