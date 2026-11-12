import { type CollectionEntry, getCollection } from 'astro:content'

export async function getSortedPosts() {
  const posts = await getCollection('posts', ({ data }) => !data.draft)
  return posts.sort(
    (a, b) =>
      b.data.published.getTime() - a.data.published.getTime() ||
      a.slug.localeCompare(b.slug, 'ja'),
  )
}

export function getTaxonomy(
  posts: CollectionEntry<'posts'>[],
  field: 'tags' | 'category',
) {
  const counts = new Map<string, number>()
  for (const post of posts) {
    const values =
      field === 'tags'
        ? [...new Set(post.data.tags ?? [])]
        : [post.data.category || 'uncategorized']
    for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1)
  }
  return [...counts]
    .sort(([a], [b]) => a.localeCompare(b, 'ja'))
    .map(([name, count]) => ({ name, count }))
}
