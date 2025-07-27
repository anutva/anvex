import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path' // Make sure to import the 'path' module


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  }
});
