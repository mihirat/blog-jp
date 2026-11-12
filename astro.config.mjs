import sitemap from '@astrojs/sitemap'
import { defineConfig } from 'astro/config'

export default defineConfig({
  site: 'https://techeten.xyz/',
  trailingSlash: 'always',
  integrations: [sitemap()],
})
