import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Tách bundle thành các chunk nhỏ để tải song song
    rollupOptions: {
      output: {
        manualChunks: {
          // Tách React core ra riêng - cached lâu dài
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Tách thư viện UI/icon
          'ui-vendor': ['react-icons', 'swiper'],
          // Tách thư viện player
          'player-vendor': ['react-player'],
          // Tách axios riêng
          'axios': ['axios'],
        }
      }
    },
    // Giảm threshold cảnh báo chunk size
    chunkSizeWarningLimit: 1000,
    // Bật source map cho production debugging (tắt nếu muốn bundle nhỏ hơn)
    sourcemap: false,
    // Minify với esbuild (mặc định, nhanh hơn terser)
    minify: 'esbuild',
    // Loại bỏ console.log trong production
    esbuildOptions: {
      drop: ['console', 'debugger'],
    }
  },
  // Tối ưu cho development
  server: {
    // Bật HMR nhanh hơn
    hmr: true,
  },
  // Tối ưu dependencies pre-bundling
  optimizeDeps: {
    include: ['react', 'react-dom', 'axios', 'react-router-dom'],
  }
})
