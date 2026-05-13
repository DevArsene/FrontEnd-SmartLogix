import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/inventory': {
        target: 'http://localhost:8082',
        changeOrigin: true,
      },
      '/api/orders': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
      '/api/bff': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    }
  }
});