import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// NOTE: Vite 8 uses rolldown which requires manualChunks as a function (not object)
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Vite 8 / rolldown: manualChunks must be a function
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('three') || id.includes('@react-three')) return 'vendor-three';
            if (id.includes('framer-motion'))                          return 'vendor-motion';
            if (id.includes('@supabase'))                              return 'vendor-supabase';
            if (id.includes('@google/generative-ai'))                  return 'vendor-gemini';
            if (id.includes('lucide-react'))                           return 'vendor-ui';
          }
        },
      },
    },
    // Warn on chunks > 500 kB
    chunkSizeWarningLimit: 500,
  },
})


