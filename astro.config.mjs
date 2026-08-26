// @ts-check
import { defineConfig } from "astro/config";

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
});
