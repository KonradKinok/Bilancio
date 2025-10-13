import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()], // Enable React with Fast Refresh
  base: `./`, // Relative paths for Electron compatibility
  build: {
    outDir: "dist-react", // Output directory for renderer process
  },
  server: {
    port: 5123, // Custom port for dev server
    strictPort: true, // Fail if port is occupied
  },
})
