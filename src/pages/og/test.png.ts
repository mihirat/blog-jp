import type { APIContext } from "astro";
import { getCollection, getEntry } from "astro:content";
import { getOgImage } from "@components/OgImage";

export async function getStaticPaths() {
    const blogEntries = await getCollection('posts', ({ data }) => {
        return import.meta.env.PROD ? data.draft !== true : true;
    });
    return blogEntries.map(entry => ({
        params: { slug: entry.slug }, props: { entry },
    }));
}

export async function get({ params }: APIContext) {
//   console.log(params);
//   const post = await getEntry('posts', params.slug);
//   const body = await getOgImage(post?.data.title ?? "No title");
  const body = await getOgImage("てすと");
  return { body, encoding: "binary" };
}
