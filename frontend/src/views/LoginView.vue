<template>
    <v-card class="pa-6" width="400">
        <v-card-title class="text-h5 text-center">Iniciar sesión</v-card-title>

        <v-form @submit.prevent="handleLogin" v-model="valid">
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
            />
            <v-btn
                :loading="loading"
                :disabled="!valid"
                type="submit"
                color="primary"
                class="mt-4"
                block
            >
                Ingresar
            </v-btn>

            <div class="text-right my-2">
                <router-link
                    to="/forgot-password"
                    class="text-caption text-primary text-decoration-none"
                >
                    ¿Has olvidado tu contraseña?
                </router-link>
            </div>
        </v-form>

        <v-alert v-if="message" type="success" class="mt-4">{{
            message
        }}</v-alert>
    </v-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRoute } from "vue-router";
import { email, password } from "../constants/formRules";
import { showToast } from "../utils/swalToast";

const auth = useAuthStore();
const route = useRoute();
const message = route.query.msg;
const valid = ref<boolean>(false);
const loading = ref<boolean>(false);
const showPass = ref<boolean>(false);

const formRules = {
    email: email,
    password: password,
};

const handleLogin = async () => {
    const loginError = await auth.login(form.value);

    if (loginError) {
        showToast({ message: auth.error, icon: "error" });
    }
};

function handleShowPass() {
    showPass.value = !showPass.value; // Acceso a la propiedad reactiva
}

const form = ref({
    email: "",
    password: "",
});

onMounted(() => {
    if (message && typeof message === "string") {
        showToast({ message, icon: "success" });
    }
});
</script>
