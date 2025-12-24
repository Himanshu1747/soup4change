// // astro.config.mjs
// import { defineConfig } from 'astro/config';
// import node from '@astrojs/node';
// import mdx from '@astrojs/mdx';
// import sitemap from '@astrojs/sitemap';

// export default defineConfig({
//   site: 'https://example.com',
//   output: 'server', // <-- THIS IS THE MOST IMPORTANT LINE
//   adapter: node({
//     mode: 'standalone',
//   }),
//   integrations: [mdx(), sitemap()],
// });


// import { defineConfig } from 'astro/config';
// import netlify from '@astrojs/netlify'; // Changed this
// import mdx from '@astrojs/mdx';
// import sitemap from '@astrojs/sitemap';

// export default defineConfig({
//   site: 'https://example.com',
//   output: 'server',
//   adapter: netlify(), // Changed this
//   integrations: [mdx(), sitemap()],
// });

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://example.com',
	integrations: [mdx(), sitemap()],
});
