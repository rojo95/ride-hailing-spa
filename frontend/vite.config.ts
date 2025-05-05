import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";
import path from "path";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd());

    const apiPath = env.VITE_API_BASE_PATH || "/api";
    const apiHost = env.VITE_API_HOST || "http://localhost:5000";

    return {
        plugins: [
            vue(),
            vuetify({ autoImport: true }), // Esto es importante
        ],
        server: {
            proxy: {
                [apiPath]: {
                    target: apiHost,
                    secure: true,
                    changeOrigin: false,
                },
            },
        },
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "src"),
            },
        },
    };
});
