# abhayemekar.me

My personal site — a single page covering what I build, where I've worked, and how
to reach me. Live at **[abhayemekar.me](https://abhayemekar.me)**.

Built as a static bundle and served from GitHub Pages. No CMS, no analytics, no
tracking.

## Stack

| | |
|---|---|
| Build | Vite 8, TypeScript 7 (strict) |
| UI | React 19 |
| Styling | Tailwind CSS v4 (CSS-first, no config file) |
| Motion | `motion` v13, loaded through `LazyMotion` |
| Fonts | Instrument Serif, Inter Tight, JetBrains Mono — self-hosted, latin subset |
| Assets | favicons and the OG card generated offline with `sharp` |
| Deploy | GitHub Actions → GitHub Pages |

## Running it

```bash
npm install
npm run dev
```

```bash
npm run build && npm run preview
```

`npm run build` typechecks before bundling, so a type error fails the build.

## Structure

```
src/data/          content as typed TS — copy, projects, skills, credentials
src/components/    one component per section
src/hooks/         theme, active-section tracking
src/styles/        design tokens and @font-face rules
scripts/           gen-assets.mjs — SVG monogram → favicons + OG image
public/            CNAME, robots.txt, sitemap.xml, 404.html, generated assets
```

Content lives in `src/data/*.ts`, so updating the site means editing data rather
than markup.

## Notes

Dark theme by default with a light toggle, set before first paint to avoid a flash.
Respects `prefers-reduced-motion`. Keyboard navigable with a skip link, semantic
landmarks, and WCAG AA contrast verified in both themes.

Lighthouse, both form factors: performance 96 (mobile) / 100 (desktop),
accessibility 100, best practices 100, SEO 100. axe-core reports zero violations.

## Reuse

The written content, project write-ups and imagery are mine — please don't reuse
those as your own. If something in the build setup is useful to you, take it.
