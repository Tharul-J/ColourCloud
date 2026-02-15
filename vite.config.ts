import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      // Map GEMINI_API_KEY (from Netlify) to VITE_GEMINI_API_KEY for client-side
      define: {
        'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(
          env.VITE_GEMINI_API_KEY || env.GEMINI_API_KEY
        )
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
