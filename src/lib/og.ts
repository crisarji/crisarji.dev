import satori from "satori";
import sharp from "sharp";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";

/* Social cards, generated at build time.
 *
 * satori turns a layout into SVG with the text already converted to paths, so
 * rasterising never depends on fonts being installed in the build container.
 * sharp then does SVG -> PNG, and sharp is already here for astro:assets —
 * which is why this avoids @resvg/resvg-js. One less package shipping
 * platform-specific native binaries, given what those already cost us in
 * this repo's lock file.
 *
 * Phase 2 of the rebuild extends this into the per-project cover art. The
 * layout below is the shared card only. */

const require = createRequire(import.meta.url);

const font = (pkg: string, file: string) =>
  readFile(require.resolve(`${pkg}/files/${file}`));

const fonts = await Promise.all([
  font("@fontsource/inter", "inter-latin-400-normal.woff"),
  font("@fontsource/inter", "inter-latin-700-normal.woff"),
  font("@fontsource/jetbrains-mono", "jetbrains-mono-latin-500-normal.woff"),
]);

const FONTS = [
  { name: "Inter", data: fonts[0], weight: 400 as const, style: "normal" as const },
  { name: "Inter", data: fonts[1], weight: 700 as const, style: "normal" as const },
  { name: "Mono", data: fonts[2], weight: 500 as const, style: "normal" as const },
];

/* The site's dark tokens. A card is seen against someone else's timeline, not
   against the page it came from, so it commits to the dark end of the palette
   where the accent pair carries furthest. */
const GROUND = "#07080C";
const INK = "#F3F5F9";
const BODY = "#B7BECE";
const MUTED = "#7E8699";
const RULE = "#232834";
const ACCENT = "#2DD4BF";
const ACCENT_2 = "#8B8CF7";

export interface CardInput {
  title: string;
  /** Small line above the title — "Case study", "Experience", etc. */
  eyebrow?: string;
  /** Optional supporting line under the title. */
  subtitle?: string;
  /** Rendered as small pills along the bottom. */
  tags?: string[];
}

export async function ogImage({ title, eyebrow, subtitle, tags = [] }: CardInput) {
  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          width: 1200,
          height: 630,
          display: "flex",
          background: GROUND,
          fontFamily: "Inter",
        },
        children: [
          /* Duotone edge: two solid blocks rather than a gradient, so the card
             never depends on satori's gradient support. */
          {
            type: "div",
            props: {
              style: { display: "flex", flexDirection: "column", width: 14 },
              children: [
                { type: "div", props: { style: { flex: 3, background: ACCENT } } },
                { type: "div", props: { style: { flex: 2, background: ACCENT_2 } } },
              ],
            },
          },
          {
            type: "div",
            props: {
              style: {
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: "68px 72px",
              },
              children: [
                {
                  type: "div",
                  props: {
                    style: { display: "flex", flexDirection: "column", gap: 18 },
                    children: [
                      eyebrow && {
                        type: "div",
                        props: {
                          style: {
                            fontFamily: "Mono",
                            fontSize: 22,
                            fontWeight: 500,
                            letterSpacing: 3,
                            textTransform: "uppercase",
                            color: ACCENT,
                          },
                          children: eyebrow,
                        },
                      },
                      {
                        type: "div",
                        props: {
                          style: {
                            fontWeight: 700,
                            // Long titles must not overflow the card.
                            fontSize: title.length > 46 ? 60 : 74,
                            lineHeight: 1.1,
                            letterSpacing: -2.5,
                            color: INK,
                          },
                          children: title,
                        },
                      },
                      subtitle && {
                        type: "div",
                        props: {
                          style: {
                            fontSize: 28,
                            lineHeight: 1.4,
                            color: BODY,
                            // Two lines at most; satori has no line-clamp.
                            maxWidth: 900,
                          },
                          children:
                            subtitle.length > 120 ? `${subtitle.slice(0, 117)}…` : subtitle,
                        },
                      },
                    ].filter(Boolean),
                  },
                },
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    },
                    children: [
                      {
                        type: "div",
                        props: {
                          style: { display: "flex", gap: 12 },
                          children: tags.slice(0, 5).map((t) => ({
                            type: "div",
                            props: {
                              style: {
                                fontFamily: "Mono",
                                fontSize: 20,
                                color: MUTED,
                                border: `1px solid ${RULE}`,
                                borderRadius: 999,
                                padding: "6px 18px",
                              },
                              children: t,
                            },
                          })),
                        },
                      },
                      {
                        type: "div",
                        props: {
                          style: {
                            fontFamily: "Mono",
                            fontSize: 24,
                            fontWeight: 500,
                            color: INK,
                          },
                          children: "crisarji.dev",
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    { width: 1200, height: 630, fonts: FONTS },
  );

  return sharp(Buffer.from(svg)).png().toBuffer();
}

export const OG_HEADERS = {
  "Content-Type": "image/png",
  "Cache-Control": "public, max-age=31536000, immutable",
};
