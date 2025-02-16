import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import removeConsole from 'vite-plugin-remove-console';
export default defineConfig({
  plugins: [react(), removeConsole()],
  server: {
    open: true, // 🚀 Ouvre automatiquement le navigateur
  },
});
