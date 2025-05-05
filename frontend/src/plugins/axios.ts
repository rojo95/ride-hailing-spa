import axios from "axios";

const instance = axios.create({
    baseURL: `${import.meta.env.VITE_API_HOST + import.meta.env.VITE_API_BASE_PATH}/`,
});

instance.interceptors.request.use((config) => {
    return config;
});

export default instance;
