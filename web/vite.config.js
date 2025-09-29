import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),  nodePolyfills()],
  base: '/',
  server: {
    port: 3000,
    host: '127.0.0.1',
    allowedHosts: [
      'namely-big-osprey.cloudpub.ru'
    ]
  },
  resolve: {
    alias: {
      '@components': '/src/components',
      '@helpers': '/src/helpers',
      '@hooks': '/src/hooks',
      '@schemas': '/src/schemas',
      '@store': '/src/store',
      '@metacom': '/src/metacom',
      '@pages': '/src/pages',
      '@providers': '/src/providers',
      '@routes': '/src/routes',
    }
  }
})
