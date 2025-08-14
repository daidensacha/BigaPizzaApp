import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // your backend
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // ✅ base alias
      '@components': path.resolve(__dirname, './src/components'),
      '@auth': path.resolve(__dirname, './src/components/auth'),
      '@guidedinputflow': path.resolve(
        __dirname,
        './src/components/guidedinputflow'
      ),
      '@pizzas': path.resolve(__dirname, './src/components/pizzas'),
      '@routes': path.resolve(__dirname, './src/components/routes'),
      '@ui': path.resolve(__dirname, './src/components/ui'),
      '@constants': path.resolve(__dirname, './src/constants'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@accounts': path.resolve(__dirname, './src/pages/account'),
      '@recipes': path.resolve(__dirname, './src/pages/recipes'),
      '@pizzamenu': path.resolve(__dirname, './src/pages/pizzamenu'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@context': path.resolve(__dirname, './src/context'),
      '@data': path.resolve(__dirname, './src/data'),
      '@services': path.resolve(__dirname, './src/services'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@config': path.resolve(__dirname, './src/config'),
    },
  },
});
