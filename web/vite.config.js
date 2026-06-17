import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";
export default defineConfig({
    plugins: [react()],
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    react: ["react", "react-dom", "react-router-dom"],
                    charts: ["recharts"],
                    icons: ["lucide-react"],
                    axios: ["axios"],
                },
            },
        },
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    server: {
        port: 3000,
    },
});
