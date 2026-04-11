import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Change this to your desired port
    strictPort: true, // Optional: Fails if the port is already in use, rather than picking the next available one
  }
})