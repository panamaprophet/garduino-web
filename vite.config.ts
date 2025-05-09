import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    base: '/garduino-web',
    plugins: [react()],
    root: 'src',
    envDir: '../',
    build: { outDir: '../dist' },
    resolve: {
        alias: [{
            find: '@',
            replacement: fileURLToPath(new URL('./src', import.meta.url)),
        }],
    },
    server: {
        open: true,
    },
});
