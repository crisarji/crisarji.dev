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
 * this repo's lock file. */

const require = createRequire(import.meta.url);

const font = (pkg: string, file: string) =>
  readFile(require.resolve(`${pkg}/files/${file}`));

const fonts = await Promise.all([
  font("@fontsource/fraunces", "fraunces-latin-700-normal.woff"),
  font("@fontsource/karla", "karla-latin-400-normal.woff"),
  font("@fontsource/karla", "karla-latin-500-normal.woff"),
]);

const FONTS = [
  { name: "Fraunces", data: fonts[0], weight: 700 as const, style: "normal" as const },
  { name: "Karla", data: fonts[1], weight: 400 as const, style: "normal" as const },
  { name: "Karla", data: fonts[2], weight: 500 as const, style: "normal" as const },
];

/* The site's own tokens, so a shared card looks like the page it came from. */
const INK = "#151B19";
const BODY = "#2C3532";
const MUTED = "#5D6763";
const GROUND = "#F1F3EF";
const ACCENT = "#0C6C61";

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
          flexDirection: "column",
          justifyContent: "space-between",
          background: GROUND,
          padding: "68px 72px",
          // A single accent edge, rather than a border on all four sides.
          borderLeft: `14px solid ${ACCENT}`,
          fontFamily: "Karla",
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
                      fontSize: 24,
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
                      fontFamily: "Fraunces",
                      fontWeight: 700,
                      // Long titles must not overflow the card.
                      fontSize: title.length > 46 ? 62 : 76,
                      lineHeight: 1.1,
                      letterSpacing: -1.5,
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
                          fontSize: 22,
                          color: MUTED,
                          border: `1px solid #D8DDD4`,
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
                    style: { fontSize: 26, fontWeight: 500, color: INK },
                    children: "crisarji.dev",
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
