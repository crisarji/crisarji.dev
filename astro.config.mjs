// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://crisarji.dev",
  output: "static",
  trailingSlash: "never",
  build: {
    // Emit /work/foo.html rather than /work/foo/index.html so Cloudflare's
    // asset server and `trailingSlash: never` agree on the canonical URL.
    format: "file",
  },
  integrations: [
    sitemap({
      // The generated OG images are assets, not pages worth crawling.
      filter: (page) => !page.includes("/og/"),
    }),
  ],
});
