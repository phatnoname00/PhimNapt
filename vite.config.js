import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-dom') || id.includes('react-router-dom') || id.includes('/react/')) {
              return 'react-vendor';
            }
            if (id.includes('react-player') || id.includes('hls.js')) {
              return 'player-vendor';
            }
            if (id.includes('swiper')) return 'swiper-vendor';
            if (id.includes('axios')) return 'axios-vendor';
          }
        }
      }
    },
    chunkSizeWarningLimit: 1500,
    sourcemap: false,
  },

  optimizeDeps: {
    include: ['react', 'react-dom', 'axios', 'react-router-dom'],
  }
})



