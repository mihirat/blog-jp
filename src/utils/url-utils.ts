export function getPostUrlBySlug(slug: string): string {
  return `/posts/${slug.split('/').map(encodeURIComponent).join('/')}/`
}

export function getTagUrl(tag: string): string {
  return `/archive/tag/${encodeURIComponent(tag)}/`
}

export function getCategoryUrl(category: string): string {
  return `/archive/category/${encodeURIComponent(category || 'uncategorized')}/`
}
