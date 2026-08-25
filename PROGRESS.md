# PROGRESS

Append-only build log. Newest entry at the bottom. Plain markdown on purpose — it
should stay readable in any editor, on GitHub, or as raw text.

---

## 2026-08-25 — Pass one: design system and sitemap

**What changed.** Explored the ground truth before designing anything, and several
findings changed the brief:

- `abhay-yemekar.github.io` already existed, holding only `CNAME` (= `abhayemekar.me`)
  and a placeholder `README.md`, with Pages live. So the site deploys into that repo
  rather than a new one — no domain conflict, no downtime, `base: '/'` correct.
- Namecheap DNS was already correct: apex resolves to all four GitHub IPs, `www` is
  a CNAME alias. No DNS work needed.
- HTTPS for `abhayemekar.me` was **not** provisioned — `SEC_E_WRONG_PRINCIPAL`, the
  certificate was never issued. This is the one genuinely outstanding infra task.
- `gh` CLI is not installed on this machine, so `gh repo create` was moot anyway.
- yDirect's real source lives in a **private** repo. The public `ydirect` repo is
  docs/product only. Read the private one to describe the architecture accurately,
  then linked and quoted nothing from it.
- SearchScribe's current README is far stronger than the brief described (Next.js
  App Router + FastAPI, PostgreSQL, Argon2id, rotating refresh cookies with theft
  detection, nh3 sanitization, 55 backend tests, Playwright). Used the accurate
  version — it's the best engineering story on the site.
- ForecastGPT's stack confirmed from `requirements.txt` rather than assumed.
- Two projects that the brief said had no repo links do have them.
- `ydirect.tech` does not resolve, so it stays off the site.

Design system settled as "Ink & Amber": editorial, warm, one amber accent confined
to a short list of named places, dark default with a light toggle. Eight sections on
a single anchor-scrolled page. Full token table, type scale and motion spec recorded
in the plan document.

**Why.** The brief's audience gives the page 15–30 seconds, across four different
role searches. One repeating layout motif (a 160px left rail with a mono index and
label) used eight times is what makes it read as designed rather than assembled, and
restraint on the accent is what keeps it from looking like a template.

**Next.** Scaffold and build all eight sections.

**Open questions.** Resume PDF — the CTA stays hidden until one exists at
`public/resume.pdf`. Whether the live SearchScribe deploy runs the current Next.js
build or an older one.

---

## 2026-08-25 — Build: scaffold through all eight sections

**What changed.** Vite 8 + React 19 + TypeScript 7 strict + Tailwind v4 + `motion`
v13. GSAP not installed. Content lives entirely in `src/data/*.ts`; components hold
no copy. All eight sections built and responsive, plus `Nav`, `Reveal`,
`SectionShell`, `ThemeToggle`, `useTheme`, `useActiveSection`. Favicons and the
1200×630 OG card generated offline by `scripts/gen-assets.mjs`. Actions workflow,
`CNAME`, `robots.txt`, `sitemap.xml`, `404.html`, webmanifest all in place.

Things that went wrong and how they were fixed:

- **TS2882** on the `globals.css` side-effect import — TypeScript 7 needs
  `src/vite-env.d.ts` with the Vite client reference.
- **Fonts shipped every subset.** The `@fontsource*` packages have no per-subset
  CSS, so importing their index files pulled cyrillic, greek and vietnamese —
  ~430KB. Replaced with four hand-authored `@font-face` rules using Fontsource's own
  latin `unicode-range`. 430KB → 128KB.
- **OG card rendered the sans line in a mono face.** sharp rasterises SVG through
  librsvg, which resolves only fonts installed on the machine and maps every generic
  family to the same default. Embedded base64 `@font-face` is ignored too. Switched
  to named Windows fonts and documented the limitation in the script.
- **`fg-subtle` failed WCAG AA.** Measured 3.23–3.66:1 (dark) and 3.68–3.98:1
  (light) on 11–12px metadata, which gets no large-text exemption. Darkened light to
  `#6b6862`, lightened dark to `#8b8680`. All 26 pairs now pass, worst case 4.71:1.
- **Scroll-spy decided from one IntersectionObserver batch.** IO reports only what
  *changed*, so a batch containing a single "left the band" entry had nothing to pick
  from and the highlight landed on the wrong section. Rewrote `useActiveSection` to
  keep an `inBand` map across callbacks.
- **Footer was inside `<main>`.** Moved out so it is a body-level landmark.
- A comment claimed the copyright year was baked in at build time. It is not — the
  page is not prerendered, so it is the visitor's clock. Comment corrected.

**Why.** The typed-data split means every future content edit is a one-file change
with no markup churn, which is the whole point of skipping a CMS.

**Next.** Audits.

---

## 2026-08-25 — Verification: axe clean, Lighthouse 95+ both form factors

**What changed.** axe-core 4.13 over wcag2a/2aa/21a/21aa/best-practice: **0
violations, 35 passes**. Two `incomplete` colour-contrast nodes, both footer micro
text, flagged only because axe could not resolve the stacking to determine a
background — those pairs measure 5.45:1 (dark) and 5.1:1 (light), so they pass.

Lighthouse first reported **performance 41** on mobile, with FCP 5.7s, LCP 5.9s and
TBT 1790ms. That was a measurement artifact: I had passed `--preset=perf`, which is
not a real Lighthouse preset, and it produced junk throttling. A clean run scored
**94**. Recording this because the bogus numbers sent me looking for a layout
pathology that did not exist.

The real gap was FCP 2.3s / LCP 2.5s, and LCP was **100% render delay** — nothing
paints until React boots, so the hero `<h1>` does not exist and its font is not even
requested until ~2.2s. Two fixes:

1. **Preload the hero font.** A small Vite plugin injects the `<link rel="preload">`
   at build time, because Vite content-hashes font filenames and the hash is only
   known once the bundle is emitted. Only that one face is preloaded — every extra
   preload competes with the JS bundle for bandwidth. LCP 2.5s → 2.3s, and CLS
   dropped 0.045 → 0.015 as the font-swap shift disappeared.
2. **Trim motion.** Components now import `m` from `motion/react-m` under
   `<LazyMotion features={domAnimation} strict>`. `domAnimation` covers animations,
   gestures and `whileInView` but drops drag and layout projection, neither of which
   this site uses. Bundle 110.18 → 98.68 kB gzip.

Verified `whileInView` still fires after the swap by pulling Lighthouse's full-page
screenshot (a real compositing browser, unlike the preview pane) and measuring ink
coverage across 26 horizontal bands of the 13,166px page — every band had content,
so nothing was stranded at `opacity: 0`.

Final: **mobile 96 / 100 / 100 / 100**, **desktop 100 / 100 / 100 / 100**.

**Privacy gate passed.** No phone patterns, `tel:` hrefs, or street/address tokens
in source, `dist/`, or git history. JSON-LD `PostalAddress` is city-level only —
no `streetAddress`, `postalCode` or `telephone`. Contact is the `mailto:` link.

**Why the flag mattered.** Worth remembering that an invalid Lighthouse preset fails
open rather than erroring, so it silently reports numbers that look like a real
regression.

**Next.** First commit, then deploy and fix HTTPS.

**Open questions.** Still waiting on the resume PDF and on whether the live
SearchScribe deploy is the current build. Neither blocks the deploy.

---

## 2026-08-25 — Committed, ready to push

**What changed.** Eight scoped commits on top of the repo's existing two, so the
push is a plain fast-forward with no unrelated histories and no force-push:
scaffold → styles → data → hooks → sections → head/assets → CI → docs.

Added `.gitattributes` pinning `* text=auto eol=lf`. This machine has
`core.autocrlf=true` globally, which stores LF and checks out CRLF — the right
outcome, but it depends on a machine-level setting, so a clone elsewhere would
commit different bytes. Two components had been rewritten with CRLF by an
earlier scripted edit; the attributes file normalised them on the way in.

`.claude/settings.local.json` is now gitignored — it is per-machine permission
state. `.claude/launch.json` stays committed, since it is shared preview config.

Verified before committing: `tsc --noEmit` clean, build clean at 98.68 kB gzip,
`dist/` untracked, privacy gate re-run across all eight new commits (the only
hits are the docs *describing* the constraint — no phone number, no address, no
`streetAddress`/`postalCode`/`telephone` keys anywhere).

Reduced motion and focus were verified structurally rather than by hand, because
the preview pane in this environment does not composite: a global
`prefers-reduced-motion` rule clamps animation and transition durations to
0.01ms, the three animated components each branch on `useReducedMotion()`, and a
bare `:focus-visible` rule gives every focusable element a 2px amber outline at
3px offset in both themes. A physical keyboard pass is still worth doing once the
site is live.

**Why the git split.** Eight commits rather than one because the history is the
only place a future reader can see *why* each piece is shaped the way it is —
the font subsetting, the IntersectionObserver rewrite, the `LazyMotion` scope.
Only the final commit yields a building tree, which is normal for an initial
import and not worth contorting the split to avoid.

**Next.** Push (Abhay runs it — needs the SSH passphrase), switch the repo's
Pages source from branch to GitHub Actions, then fix HTTPS: remove and re-add
`abhayemekar.me` in Pages settings to force certificate issuance, wait for
"Certificate created", tick Enforce HTTPS. DNS needs no changes. Then update the
Gamma placeholder link on LinkedIn.

**Open questions.** Unchanged: the resume PDF, and whether the live SearchScribe
deploy runs the current Next.js build. Neither blocks the deploy.
