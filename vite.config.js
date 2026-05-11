import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/inventory': {
        target: 'http://localhost:8082',
        changeOrigin: true,
      },
      //aquí se deben agregar las demas urls necesarias para cada microservicio
      '/orders': {
        target: 'http://localhost:8083',
        changeOrigin: true,
      },
    }
  }
})