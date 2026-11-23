import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MantineProvider } from "@mantine/core";
import AuthProvider from './context/AuthContext.tsx';
import App from './App.tsx'
import "@mantine/core/styles.css";


createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <MantineProvider>
            <AuthProvider>
                <App />
            </AuthProvider>
        </MantineProvider>
    </StrictMode>,
)

