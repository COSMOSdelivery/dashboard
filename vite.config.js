import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import removeConsole from 'vite-plugin-remove-console';
import path from 'path';
export default defineConfig({
  plugins: [react(), removeConsole()],
  server: {
    port: 3100,
    open: true, // 🚀 Ouvre automatiquement le navigateur
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Ensure this line is present
    },
  },
});
