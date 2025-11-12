import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
    base: '/jlpt-flashcard/', // 👈 usa il nome ESATTO del tuo repository
})
