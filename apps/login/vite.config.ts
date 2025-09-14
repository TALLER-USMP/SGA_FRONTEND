import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "login",
      filename: "remoteEntry.js",
      exposes: {
        './LoginApp': './src/App.tsx'
      },
      shared: ['react', 'react-dom']
    })
  ],
  server: {
    port: 5001
  },
  build: {
    modulePreload: false,
    target: "esnext",
    minify: false,
    cssCodeSplit: false
  }
})