import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import {client} from "./gen/openapi/client.gen.ts";

client.setConfig({
    baseUrl: import.meta.env.VITE_API_URL
})

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App/>
    </StrictMode>
);
