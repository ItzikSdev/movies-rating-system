import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/ClientHub': {
        target: 'http://62.90.222.249:10001',
        changeOrigin: true,
        secure: false,
        ws: true 
      }
    }
  }
})
