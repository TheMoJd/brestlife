import {CreateClientConfig} from "@hey-api/client-next";

export const createClientConfig: CreateClientConfig = (config) => ({
    ...config,
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
    }
});