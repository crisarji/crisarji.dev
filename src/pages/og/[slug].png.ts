import type { APIContext } from "astro";
import { ogImage, OG_HEADERS } from "../../lib/og";

/* Cards for the pages that are actually on the air. The project cards and the
   /work card come back in phase 5 along with those routes — generating them
   now would mean social previews for URLs that 302 to the holding page. */

type Card = {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  tags?: string[];
};

/* The wordmark sits in the bottom-right of every card, so the eyebrow says
   something else — repeating the domain twice wasted the one line of context
   a shared card gets. */
const PAGES: Record<string, Card> = {
  site: {
    title: "Cristian Arce",
    eyebrow: "Software engineer",
    subtitle:
      "Sixteen years in. Front-end architecture, design systems and micro frontends, from Costa Rica.",
    tags: ["Design systems", "Micro frontends", "Angular", "React", "Vue"],
  },
  resume: {
    title: "Cristian Arce",
    eyebrow: "Resume",
    subtitle: "Sixteen years, three companies, as plain text.",
    tags: ["2010 — now", "Gorilla Logic", "Isthmus", "Softland"],
  },
};

export function getStaticPaths() {
  return Object.keys(PAGES).map((slug) => ({ params: { slug } }));
}

export async function GET({ params }: APIContext) {
  const png = await ogImage(PAGES[params.slug!]);
  return new Response(new Uint8Array(png), { headers: OG_HEADERS });
}
