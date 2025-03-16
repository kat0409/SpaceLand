import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  define: {
    'import.meta.env.VITE_BACKEND_URL': JSON.stringify('http://localhost:3000'),
  },
})

