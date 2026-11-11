import rss from '@astrojs/rss'
import type { APIRoute } from 'astro'
import MarkdownIt from 'markdown-it'
import sanitizeHtml from 'sanitize-html'
import { siteConfig } from '../config'
import { getSortedPosts } from '../utils/content-utils'
import { getPostUrlBySlug } from '../utils/url-utils'

const parser = new MarkdownIt()

export const GET: APIRoute = async context => {
  if (!context.site) throw new Error('Astro site must be configured for RSS')
  const site = context.site
  const response = await rss({
    title: siteConfig.title,
    description: siteConfig.subtitle,
    site,
    items: (await getSortedPosts()).map(post => ({
      title: post.data.title,
      pubDate: post.data.published,
      description: post.data.description,
      link: getPostUrlBySlug(post.slug),
      content: sanitizeHtml(parser.render(post.body), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
        // Local source paths only resolve in Astro's article rendering pipeline.
        transformTags: {
          img: (tagName, attribs) => ({
            tagName,
            attribs: /^(?:https?:)?\/\//.test(attribs.src || '')
              ? { ...attribs, src: new URL(attribs.src, site).href }
              : {},
          }),
        },
        exclusiveFilter: frame => frame.tag === 'img' && !frame.attribs.src,
      }),
    })),
    customData: `<language>${siteConfig.lang}</language>`,
  })
  // HTML sanitization can retain control characters that XML 1.0 forbids.
  const xml = (await response.text()).replace(
    /[^\u0009\u000A\u000D\u0020-\uD7FF\uE000-\uFFFD\u{10000}-\u{10FFFF}]/gu,
    '',
  )
  return new Response(xml, { headers: response.headers })
}
