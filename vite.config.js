import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  esbuild: {
    drop: ['console', 'debugger'],
  },

  build: {
    rollupOptions: {
      output: {
        // Vite 8 yêu cầu manualChunks là Function, không phải Object
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-dom') || id.includes('react-router-dom')) return 'react-vendor';
            if (id.includes('/react/')) return 'react-vendor';
            if (id.includes('react-player') || id.includes('hls.js')) return 'player-vendor';
            if (id.includes('swiper')) return 'swiper-vendor';
            if (id.includes('axios')) return 'axios-vendor';
          }
        }
      }
    },
    chunkSizeWarningLimit: 1200,
    sourcemap: false,
    minify: 'esbuild',
  },

  optimizeDeps: {
    include: ['react', 'react-dom', 'axios', 'react-router-dom'],
  }
})


