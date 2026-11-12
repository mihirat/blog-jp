import { defineCollection, z } from 'astro:content'

const postsCollection = defineCollection({
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      published: z.date(),
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
  spec: defineCollection({ type: 'content' }),
}
