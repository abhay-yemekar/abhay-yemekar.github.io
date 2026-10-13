# CLAUDE.md

Personal portfolio for Abhay Yemekar. Single page, statically built, deployed to
GitHub Pages at the apex domain `abhayemekar.me`.

## Commands

```bash
npm run dev          # Vite dev server on :5173
npm run build        # tsc --noEmit, then vite build -> dist/
npm run preview      # serve dist/ on :4173 (production check)
npm run typecheck    # tsc --noEmit alone
npm run gen:assets   # regenerate favicons + og.png from the SVG monogram
```

There is no test suite and no linter. `npm run build` is the gate: it typechecks
before it bundles, so a type error fails the build (and the deploy).

Audits, run against `npm run preview`:

```bash
npx lighthouse@12 http://localhost:4173/ --chrome-flags="--headless=new --no-sandbox"
```

Add `--preset=desktop` for the desktop pass. Both form factors must stay at 95+
on all four categories. Do not pass `--preset=perf` — it is not a real preset and
silently produces junk numbers.

## Stack

- **Vite 8** + **React 19** + **TypeScript 7** (strict), bundled to `dist/`
- **Tailwind CSS v4** via `@tailwindcss/vite`, CSS-first — no `tailwind.config.js`
- **motion** v13 (Framer Motion's current package name). GSAP is deliberately not
  installed; use one animation library, not two.
- **sharp** (devDep) for offline asset generation
- No router, no CMS, no analytics, no tracking. Content lives in typed TS files.

## Layout

```
src/data/          all content — editing these needs no markup changes
src/components/    one file per section, plus Nav/Reveal/SectionShell/ThemeToggle
src/hooks/         useTheme, useActiveSection
src/styles/        globals.css (tokens) + fonts.css (@font-face)
scripts/           gen-assets.mjs — SVG monogram -> favicons + OG card
public/            CNAME, robots.txt, sitemap.xml, 404.html, favicons, og.png
index.html         meta, OG, JSON-LD, inline no-flash theme script
```

**Content changes belong in `src/data/*.ts`.** That split is the point of the
architecture — copy, projects, skills and credentials are data, not JSX.

## Conventions

### Design tokens

Colors are CSS custom properties on `[data-theme]` in `src/styles/globals.css`,
bridged to Tailwind through `@theme inline`. Use the semantic utility names
(`bg-bg-elev`, `text-fg-muted`, `border-border`), never raw hex in components.

Every fg/bg pair clears WCAG AA (4.5:1) in **both** themes. `--color-fg-subtle`
carries 11–12px metadata, which gets no large-text exemption, so it is not as dim
as it looks like it could be. If you change a token, measure the computed contrast
in-browser rather than eyeballing it.

The accent (amber) is allowed in a short list of places: section index numerals
and label rules, link underlines, the project-card top hairline, one serif-italic
clause in the hero, the active nav indicator, and the metric numerals in a
project card's stat strip (no featured project carries measured numbers right
now). No accent fills, no gradients.

### Theme

`index.html` has an inline script that sets `data-theme` on `<html>` before first
paint, reading `localStorage.theme` then `prefers-color-scheme`. `useTheme` only
*reads* that decision and writes updates — it must never be the thing that decides
the initial value, or the page flashes.

### Motion

`Reveal` wraps scroll entrances; `Hero` and `ProjectCard` animate directly.

Components import `m` from `motion/react-m`, **not** `motion` from `motion/react`.
`App.tsx` provides `<LazyMotion features={domAnimation} strict>`. `domAnimation`
covers animations, gestures and `whileInView`, but omits drag and layout
projection, which this site never uses and which are most of motion's weight.
`strict` makes a stray `motion.*` throw rather than quietly pulling the full
bundle back in.

Entrances ease `[0.16, 1, 0.3, 1]`, hovers `[0.4, 0, 0.2, 1]`. Translate never
exceeds 16px. Every variant collapses under `useReducedMotion()`, backed by a
global `prefers-reduced-motion` rule in `globals.css`.

### Fonts

`src/styles/fonts.css` declares four `@font-face` rules by hand, latin subset
only, pointing at files inside the `@fontsource*` packages. Do **not** import the
Fontsource index CSS instead — those ship cyrillic, greek and vietnamese subsets
this site never renders, which cost roughly 180KB of build output for nothing.

`vite.config.ts` injects a `<link rel="preload">` for the Instrument Serif face
that renders the hero headline. It has to be a plugin because Vite content-hashes
font filenames. Without it that font is not requested until React has rendered the
`<h1>`, which puts LCP about 300ms behind first paint.

### Accessibility

Semantic sectioning elements, exactly one `<h1>`, a skip link as the first
focusable node, visible `:focus-visible` on everything interactive. External links
carry `target="_blank" rel="noopener noreferrer"`; the mailto link does not.

## Hard constraints

These are the owner's rules, not preferences.

- **Never commit a phone number or home address** — not in source, markup, meta,
  OG tags, JSON-LD, or commit messages. Public contact is the `mailto:` link only.
  The JSON-LD `PostalAddress` is city-level (Pune / Maharashtra / IN) on purpose:
  no `streetAddress`, no `postalCode`, no `telephone`.
- **Never link to or copy anything from the private `inksl_ay` repo.** It is
  yDirect's real source. The public `abhay-yemekar/ydirect` repo is docs/product
  only and must stay labelled "source private".
- **Never run `git push`.** Hand the owner the command; they run it, since it needs
  their SSH passphrase.
- Git identity is set with `--local` only, never `--global`.
- The remote uses the `github-personal` SSH alias, never plain `github.com` — the
  default host resolves to a work identity on this machine.
- No invented projects or metrics. Numbers on the site are measured or absent.
- No analytics or tracking.
- `profile.resumeUrl` stays `null` until a real `public/resume.pdf` exists, so the
  CTA can never 404. Do not generate a resume.

## Deploy

Push to `main` triggers `.github/workflows/deploy.yml`: `npm ci` → `npm run build`
→ `upload-pages-artifact` → `deploy-pages`. Pages source is set to GitHub Actions.
`base` is `/` because the site is served from an apex domain, and `public/CNAME`
carries the domain into the artifact.
