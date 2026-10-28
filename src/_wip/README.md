# Off the air

These pages were live but half-finished, so Phase 0 of the rebuild took them
down behind the holding page. They are kept here, out of `src/pages/` and so
out of the route table, because the rebuild reuses their logic:

- `experience.astro` — the month-accurate axis maths that the new interactive
  timeline (phase 4) is built on.
- `work/` — the project index and detail routes (phase 3 and 5).
- `about.astro` — prose that the new home absorbs (phase 3).
- `rss.xml.ts` — the feed, including the `trailingSlash: false` fix that keeps
  it agreeing with `build.format: "file"`. Restore it with `/work`.

They are written against the OLD editorial token set, so expect to restyle
rather than paste. `public/_redirects` sends their URLs to `/` in the meantime,
with a 302 — they are coming back.
