import { CreateClientConfig } from "@hey-api/client-next";

export const createClientConfig: CreateClientConfig = (config) => {
    const token = localStorage.getItem("token");

    return {
        ...config,
        baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8080/hey-api',
        headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
    };
};