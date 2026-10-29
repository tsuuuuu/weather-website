/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    // Relative asset paths so the build also works from a sub-path (e.g. GitHub Pages)
    base: './',
    test: {
        environment: 'jsdom',
        setupFiles: ['./src/test/setup.ts'],
    },
})
