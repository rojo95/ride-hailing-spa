import "@mdi/font/css/materialdesignicons.css";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify.ts";
import { createPinia } from "pinia";

createApp(App).use(router).use(vuetify).use(createPinia()).mount("#app");
