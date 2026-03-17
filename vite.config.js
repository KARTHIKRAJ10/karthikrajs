import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/karthikrajs/',  // ← Change 'portfolio' to your GitHub repo name
})
