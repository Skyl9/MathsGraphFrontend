import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000,
        open: true,
    },
    test: {
        environment: 'jsdom',
        setupFiles: ['./src/setupTests.ts'],
        globals: true,
    },
    build: {
        outDir: 'dist', // Vite compile dans le dossier "dist" par défaut
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) return 'vendor';
                        if (id.includes('@mui') || id.includes('@emotion')) return 'mui';
                        if (id.includes('three') || id.includes('@react-three')) return 'three';
                        if (id.includes('better-react-mathjax') || id.includes('katex')) return 'math';
                        if (id.includes('framer-motion') || id.includes('react-window') || id.includes('@tanstack') || id.includes('gsap')) return 'utils';
                    }
                }
            }
        }
    }
});