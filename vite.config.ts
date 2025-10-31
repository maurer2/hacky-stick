import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// https://vite.dev/config/
export default defineConfig({
  base: '/hacky-stick/',
  plugins: [svelte()],
  build: {
    cssMinify: false,
  },
});
