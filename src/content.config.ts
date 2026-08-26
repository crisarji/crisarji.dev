import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

/**
 * One Markdown file per project, in src/content/projects/.
 * A typo in any frontmatter field fails the build instead of rendering an
 * empty element, which is the whole reason this schema exists.
 */
const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    blurb: z.string(),
    role: z.string(),
    period: z.string(),
    stack: z.array(z.string()).nonempty(),
    liveUrl: z.url().optional(),
    repoUrl: z.url().optional(),
    cover: z.string().optional(),
    featured: z.boolean().default(false),
    /** Hides the live link and any client name; the story still ships. */
    confidential: z.boolean().default(false),
    /**
     * Not shown anywhere — getCollection() order is platform-dependent, so
     * every listing sorts on this. Use the month the work ended.
     */
    date: z.coerce.date(),
  }),
});

export const collections = { projects };
