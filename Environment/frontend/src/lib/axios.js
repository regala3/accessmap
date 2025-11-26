import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_BACKEND_URL;

export const axiosInstance = axios.create({
    baseURL: BASE_URL + "/api",
    withCredentials: true,
});

export default axiosInstance;
console.log(BASE_URL + "/api");

