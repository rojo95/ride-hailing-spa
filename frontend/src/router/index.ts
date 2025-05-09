import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

import LoginView from "../views/LoginView.vue";
import AuthenticatedLayout from "../components/layouts/AuthenticatedLayout.vue";
import UsersView from "../views/UsersView.vue";
import ForgotPasswordView from "../views/ForgotPasswordView.vue";
import { useAuthStore } from "../stores/auth";
import GuestLayout from "../components/layouts/GuestLayout.vue";
import RegisterView from "../views/RegisterView.vue";
import VehiclesView from "../views/vehicles/VehiclesView.vue";
import CreateVehiclesView from "../views/vehicles/CreateVehiclesView.vue";
import VehicleDetailsView from "../views/vehicles/VehicleDetailsView.vue";

const routes: RouteRecordRaw[] = [
    {
        path: "/",
        component: GuestLayout,
        children: [
            { path: "/", redirect: "/login" },
            { path: "/login", name: "login", component: LoginView },
            { path: "/register", name: "register", component: RegisterView },
            {
                path: "/forgot-password",
                name: "forgot-password",
                component: ForgotPasswordView,
            },
        ],
    },
    {
        path: "/",
        component: AuthenticatedLayout,
        meta: { requiresAuth: true },
        children: [
            {
                path: "users",
                name: "users",
                component: UsersView,
                meta: { requiresAuth: true, requiresAdmin: true },
            },
            {
                path: "/vehicles",
                name: "vehicles",
                component: VehiclesView,
                children: [],
            },
            {
                path: "/vehicles/create",
                name: "vehicles-create",
                component: CreateVehiclesView,
            },
            {
                path: "/vehicles/:id",
                name: "vehicles-details",
                component: VehicleDetailsView,
            },
        ],
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Middleware: protección de rutas
router.beforeEach((to, _from, next) => {
    const auth = useAuthStore();
    const token = auth.token;
    const role = auth.role;

    if (to.meta.requiresAuth && !token) {
        return next("/login");
    }

    if (to.meta.requiresAdmin && role !== "admin") {
        return next("/vehicles");
    }

    if (to.path === "/login" && token) {
        return next("/vehicles");
    }

    next();
});

export default router;
