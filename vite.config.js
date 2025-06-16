import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/chicktopia1/', // Changed back for GitHub Pages URL
  plugins: [react()],
})
