import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000,
        open: true,
    },
    build: {
        outDir: 'dist', // Vite compile dans le dossier "dist" par défaut
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom', 'react-router-dom'],
                    mui: ['@mui/material', '@mui/icons-material', '@mui/system', '@emotion/react', '@emotion/styled'],
                    three: ['three', '@react-three/fiber', '@react-three/drei'],
                    math: ['better-react-mathjax', 'katex'],
                    utils: ['framer-motion', 'react-window', '@tanstack/react-query', 'gsap']
                }
            }
        }
    }
});