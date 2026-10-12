import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    index: 'index.html',
    historyApiFallback: {
      rewrites: [
        { from: /^\/$/, to: '/index.html' },
        { from: /^\/categories$/, to: '/index.html' },
        { from: /^\/stock$/, to: '/index.html' },
        { from: /^\/alerts$/, to: '/index.html' },
      ],
    },
  },
});