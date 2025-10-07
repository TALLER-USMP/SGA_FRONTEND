import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "login",
      filename: "remoteEntry.js",
      exposes: {
        "./LoginApp": "./src/App.tsx",
      },
      shared: ["react", "react-dom", "react-router-dom", "@azure/msal-react"],
    }),
    tailwindcss(),
  ],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:7071", //modificar en produccion con el link de azure nube
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    modulePreload: false,
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
});
