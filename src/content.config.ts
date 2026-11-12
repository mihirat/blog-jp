import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

const postsCollection = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/posts',
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      published: z.coerce.date(),
      draft: z.boolean().optional(),
      description: z.string().optional(),
      image: z
        .string()
        .transform(async src => {
          if (!src || /^(?:\/|https?:|data:)/i.test(src)) return src
          return image().parseAsync(src)
        })
        .optional(),
      tags: z.array(z.string()).optional(),
      category: z.string().optional(),
    }),
})
export const collections = {
  posts: postsCollection,
  spec: defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/spec' }),
  }),
}
