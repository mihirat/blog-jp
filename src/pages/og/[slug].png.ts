import type { APIContext } from "astro";
import { getCollection, getEntryBySlug } from "astro:content";
import { getOgImage } from "@components/OgImage";

export async function getStaticPaths() {
    const blogEntries = await getCollection('posts', ({ data }) => {
        return import.meta.env.PROD ? data.draft !== true : true;
    });
    return blogEntries.map(entry => ({
        params: { slug: entry.slug },
    }));
}

export async function get({ params }: APIContext) {
  const post = await getEntryBySlug('posts', params.slug);
  const body = await getOgImage(post?.data.title ?? "No title");

  return { body, encoding: "binary" };
}
