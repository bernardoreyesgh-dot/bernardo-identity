import { defineConfig } from 'astro/config';

// GitHub Pages project site: https://bernardoreyesgh-dot.github.io/bernardo-identity/
// If the site moves to a user page or a custom domain, update `site` and `base`.
export default defineConfig({
  site: 'https://bernardoreyesgh-dot.github.io',
  base: '/bernardo-identity',
  output: 'static',
});
