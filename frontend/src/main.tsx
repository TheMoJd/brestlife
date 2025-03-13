import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import {AuthProvider} from './contexts/AuthProvider.tsx';
import {client} from "./gen/openapi/client.gen.ts";

client.setConfig(
    {
        baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8080/api'
    }
)

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AuthProvider>
            <App/>
        </AuthProvider>
    </StrictMode>
);
