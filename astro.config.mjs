// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import icon from 'astro-icon';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: vercel(),
  server: { port: 4321 },
  integrations: [icon()],
  vite: {
    plugins: [tailwindcss()],
  },
});
