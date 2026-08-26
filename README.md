# crisarji.dev

Personal site: portfolio, case studies, and a resume rendered as an experience
map. Static Astro, no client-side framework, deployed to Cloudflare Workers.

## Running it

```
npm install
npm run dev      # http://localhost:4321
npm run build    # → dist/
npm run check    # types + Astro diagnostics
```

## Adding a project

1. Create `src/content/projects/<slug>.md`.
2. Fill the frontmatter — the schema in `src/content.config.ts` is enforced at
   build time, so a missing or misspelled field fails the build.
3. Drop screenshots in `public/projects/`.
4. Commit. The slug becomes the URL: `/work/<slug>`.

Use the six-part spine in `example-project.md` for the body: problem →
constraints → architecture → decisions → what I'd change → outcome.

## Layout

```
src/
  content/projects/   one .md per case study
  content.config.ts   Zod schema for the above
  data/               experience.json (phase 3)
  layouts/            BaseLayout — head, meta, theme script
  components/         Header, Footer, ThemeToggle, ProjectCard
  pages/              routes
  styles/global.css   design tokens + reset
public/projects/      screenshots, diagrams
```

## Status

- [x] **Phase 1** — skeleton: tokens, layout, `/`, `/about`, `/404`, dark mode
- [x] Case study collection, `/work`, `/work/[slug]`
- [ ] **Phase 2** — technology filters on `/work`; two real case studies
- [ ] **Phase 3** — `experience.json`, `/experience` map, `/resume` + print CSS
- [ ] **Phase 4** — generated OG images, RSS, sitemap, Lighthouse pass

## Deploy

Cloudflare Workers static assets, configured in `wrangler.jsonc`. Build command
`npm run build`, output directory `dist`. Every push to `main` deploys; pull
requests get preview URLs.
