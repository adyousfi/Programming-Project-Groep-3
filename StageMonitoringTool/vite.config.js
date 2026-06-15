import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/login': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/logout': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/me': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/select-user': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/create-user': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/update-user': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/delete-user': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/select-stage': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/update-stage': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/select-docent': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
