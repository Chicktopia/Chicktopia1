import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/chicktopia1/', // This MUST match your repository name!
  plugins: [react()],
})
