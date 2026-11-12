import sitemap from '@astrojs/sitemap'
import { defineConfig } from 'astro/config'

export default defineConfig({
  site: 'https://techeten.xyz/',
  trailingSlash: 'always',
  compressHTML: true,
  integrations: [sitemap()],
})
