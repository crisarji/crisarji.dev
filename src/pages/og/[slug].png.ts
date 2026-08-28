import { getCollection } from "astro:content";
import type { APIContext } from "astro";
import { ogImage, OG_HEADERS } from "../../lib/og";

/* One card per case study, plus a fallback for the site's fixed pages. Static
   output, so every path is enumerated here at build time. */

const PAGES: Record<string, { title: string; eyebrow?: string; subtitle?: string }> = {
  site: {
    title: "I build systems and write down why they are shaped that way.",
    subtitle: "Case studies, an experience map, and the decisions behind both.",
  },
  work: {
    title: "Work",
    eyebrow: "Case studies",
    subtitle: "The problem, the constraints, the decisions, and what I'd change.",
  },
  experience: {
    title: "Experience",
    eyebrow: "Timeline",
    subtitle: "Roles, and the stack as it accumulated.",
  },
  resume: {
    title: "Cristian Arce",
    eyebrow: "Resume",
    subtitle: "Sixteen years, three companies, as plain text.",
  },
  about: {
    title: "Cristian Arce",
    eyebrow: "About",
    subtitle: "Software engineer in Costa Rica. ERP back ends, then front-end architecture.",
  },
};

export async function getStaticPaths() {
  const projects = await getCollection("projects");

  return [
    ...Object.keys(PAGES).map((slug) => ({ params: { slug } })),
    ...projects.map((p) => ({ params: { slug: p.id }, props: { project: p } })),
  ];
}

export async function GET({ params, props }: APIContext) {
  const project = (props as any)?.project;

  const png = project
    ? await ogImage({
        eyebrow: "Case study",
        title: project.data.title,
        subtitle: project.data.blurb,
        tags: project.data.stack,
      })
    : await ogImage(PAGES[params.slug!]);

  return new Response(new Uint8Array(png), { headers: OG_HEADERS });
}
