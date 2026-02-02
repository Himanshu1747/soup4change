import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import netlify from '@astrojs/netlify'; // This must be netlify now

export default defineConfig({
  output: 'server',
  adapter: netlify(),
  integrations: [react()],
});