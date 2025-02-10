import {CreateClientConfig} from "@hey-api/client-next";

export const createClientConfig: CreateClientConfig = (config) => ({
    ...config,
    baseUrl: 'http://localhost:8080/api',
});