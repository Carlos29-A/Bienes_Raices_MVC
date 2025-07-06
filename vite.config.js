import { defineConfig } from 'vite';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

export default defineConfig({
    // Configuración base
    base: '/',
    
    // Configuración de variables de entorno
    define: {
        'process.env.VITE_CHATBOT_OPENROUTER_KEY': JSON.stringify(process.env.VITE_CHATBOT_OPENROUTER_KEY)
    },

    // Configuración del servidor de desarrollo
    server: {
        port: 3000,
        open: true
    },

    // Configuración de build
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        sourcemap: true
    }
}); 