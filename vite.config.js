import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  // Xóa console.log và debugger trong production build
  esbuild: {
    drop: ['console', 'debugger'],
  },

  build: {
    // Tách bundle thành các chunk nhỏ để tải song song và cache dài hạn
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'player-vendor': ['react-player'],
          'swiper-vendor': ['swiper'],
          'axios': ['axios'],
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

