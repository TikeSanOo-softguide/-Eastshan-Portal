import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
    ],
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (
                        id.includes('node_modules/recharts') ||
                        id.includes('node_modules/d3-') ||
                        id.includes('node_modules/victory-vendor')
                    ) {
                        return 'admin-charts';
                    }

                    if (
                        id.includes('node_modules/@tiptap') ||
                        id.includes('node_modules/prosemirror')
                    ) {
                        return 'admin-editor';
                    }

                    return undefined;
                },
            },
        },
    },
});
