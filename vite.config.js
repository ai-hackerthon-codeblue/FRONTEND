import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://34c3ed685c41.ngrok-free.app/',
        changeOrigin: true,
      },
    },
  },
})
