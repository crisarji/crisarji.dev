import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";

/* No blog, so the feed carries case studies. Newest first, same sort key the
   /work index uses, so the feed and the page can never disagree on order. */
export async function GET(context: APIContext) {
  const projects = (await getCollection("projects")).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );

  return rss({
    title: "crisarji — case studies",
    description:
      "How the systems were built and why they are shaped that way. One case study per project.",
    site: context.site!,
    items: projects.map((p) => ({
      title: p.data.title,
      description: p.data.blurb,
      link: `/work/${p.id}`,
      pubDate: p.data.date,
      categories: p.data.stack,
    })),
    // The site is trailingSlash: "never"; without this the feed would link
    // to /work/foo/ which is not the canonical URL and does not resolve.
    trailingSlash: false,
    customData: "<language>en</language>",
  });
}
