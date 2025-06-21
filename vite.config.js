import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/', // Explicitly set base URL (default is '/')
  server: {
    port: 3000,
    open: true
  },
  resolve: {
    alias: {
      '@': '/src' // Optional but recommended for path aliasing
    }
  }
})