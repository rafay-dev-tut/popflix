import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // 👈 Aapka Tailwind bilkul mehfooz hai, isko nahi chhera!
  ],
  build: {
    // Agar CSS ya JS chunk ka size bara ho toh Vercel build ko fail na kare
    chunkSizeWarningLimit: 2000,
  }
})