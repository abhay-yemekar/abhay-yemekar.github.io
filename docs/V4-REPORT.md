# v4 report: the readable redesign

v3 (2026-10-21, [`V3-REPORT.md`](V3-REPORT.md)) looked like a studio showreel:
a giant particle name, display-size headings, a choreographed scroll. A review
on 2026-10-22 read it the way a recruiter does. It asked for:
- the role first
- readable small text
- less scrolling
- a light page with the profile links always to hand

v4 does that and keeps the content, the case studies, the prerendered HTML and
the accessibility work. The plan and every decision are in
[`V4-PLAN.md`](V4-PLAN.md).

It ran in four phases on `redesign/v4-readable` on 2026-10-27, each stopped at
screenshots for approval. Every number below was measured on the production
build (`npm run build && npm run preview`).

## v3 → v4

| | v3 | v4 |
|---|---|---|
| Home page height, 1440 wide | 12,254 px (13.6 screens) | **6,526 px (7.3 screens), 47% shorter** |
| Home page height, 390 wide | 14,287 px (16.9 screens) | **10,099 px (12.0 screens), 29% shorter** |
| Largest heading | the name as a full-width particle field; sections up to 96px | the role at 40–68px; sections 28–36px |
| Smallest text | 13px uppercase mono | 14px sans, sentence case |
| Default theme | dark (light behind the toggle) | **light** (dark behind the toggle) |
| Lighthouse mobile, median of 3 | 99 / 100 / 100 / 100 | **98–99 / 100 / 100 / 100** on the five indexed pages |
| Lighthouse desktop, median of 3 | 100 × 4 | **100 × 4** on the five indexed pages |
| LCP, mobile (simulated slow 4G) | 1.96 s on `/`; 2.04–2.18 s on case studies | 2.12 s on `/`; 1.90–2.19 s on case studies |
| CLS · TBT (median) | 0 · 0 ms | **0** · 0–67 ms |
| JavaScript at page start (gzip) | 1.95 kB | 1.85 kB |
| JavaScript after first paint | 75.0 kB in 3 chunks (GSAP, Lenis, OGL) | **2.2 kB in 3 chunks**, no libraries |
| CSS (gzip) | 9.8 kB | 8.8 kB |
| Fonts the home page downloads | 117 KiB (three faces) | **78 KiB** (no mono) |
| Images per page, worst case | 111 kB on `/` | 111 kB on `/` (the four posters) |
| axe-core 4.14 | 0 violations | **0 violations**: 6 pages × 2 themes × 360 / 1280 px |
| Lowest text contrast in use | 5.37:1 dark, 4.74:1 light | **5.34:1 light, 5.73:1 dark** ([table](CONTRAST.md)) |

The 404 page scores 100 / 100 / 100 / 63. The SEO score fails one check only,
"Page is blocked from indexing", which is its intended `noindex`.

On phones the LCP element is now the first paragraph of About, which reaches into
the first screen. It's text and paints with the fonts, so LCP stays near 2.1 s.

## The phases

| Phase | Commit | What it did |
|---|---|---|
| 1. The first screen | `9ad32d4` | Palette A and the type scale; the header with GitHub, LinkedIn and Resume; the hero with the role first; the projects as a 2×2 card grid with "More projects"; Lenis, OGL, the cursor and the intro removed |
| 2. The rest of the home page | `8fe7e07` | About under the hero; Experience as a role-first timeline; Education as its own section, from LinkedIn, no certifications; Skills as cards; Contact merged into one compact footer |
| 3. Case pages and motion | `af95626` | Case pages and the 404 in the v4 style; a Pause / Play button on each film instead of the site-wide motion toggle; reveals in CSS and GSAP removed; light share cards, favicon and manifest |
| 4. Quality and release | this commit | The checks below, a font and budget cleanup, `CLAUDE.md`, this report |

Screenshots: [`v4-phase-1`](screenshots/v4-phase-1/),
[`v4-phase-2`](screenshots/v4-phase-2/) and
[`v4-phase-3`](screenshots/v4-phase-3/).

## The review, point by point

| The review asked | v4 |
|---|---|
| A smaller name, a bigger role | The name shows once, in the header. The hero's heading is "Full-stack AI Engineer", the largest text on the page |
| No Pune label or live clock | Both gone. The city stays in About ("Based in Pune") and the JSON-LD |
| No "Play motion" control | Gone. Motion follows the OS setting; each film has its own Pause / Play button (WCAG 2.2.2) |
| The "show their work" section | Reduced to one line under the role, with the evidence highlight. The Sources strip and evidence card are gone |
| "Projects" instead of "Selected work" | Done; "Also built" became "More projects" |
| Readable "4 case studies" and small text | 15px beside the heading; all metadata 14px sans |
| Smaller project titles, less scrolling | 24–28px names in a 2×2 grid |
| No extra HireLens section on the home page | The explainer lives on the HireLens case page only; HireLens now links its product website |
| Experience: role over company | The role is the heading (22px), the company under it at body size, on a dated timeline |
| Capabilities in one compact view, evidence visible | "Skills": five cards, each with a "Used in" row linking the projects that show it |
| About higher; education | About is right under the hero. Education became its own section (owner's call), with the degree, junior college (HSC) and school |
| A compact footer, the name less often | One footer with the offer, the email button and the profile links. No giant email or name |
| LinkedIn, GitHub, resume in the header, always visible | Round icon buttons and a Resume pill in a header that never hides |
| Light mode | Light is the default; dark is one toggle away |
| A new colour | Palette A, warm paper, warm ink and one signal orange, from the owner's reference sites |

## Fixes the checks found

- **The header was 57px too wide at 360px**, which pushed the page sideways on
  small phones. The Resume pill drops its arrow below 640px, and the theme toggle
  moves to the footer there.
- **A clicked GitHub link kept its focus ring** when the visitor came back from
  the new tab. A mouse click on a new-tab link now drops focus; keyboard
  activation keeps it.
- **Hiding elements for the reveal animated them out first,** because the
  transition was already set. On the diagram, that also fired `transitionend`
  early, so the arrowheads came back before their lines drew. Setup now runs with
  transitions off.
- **The serif face was still preloaded** after it left the hero, competing with
  the LCP font. Only Instrument Sans is preloaded now. The unused condensed
  `@font-face`, `.u-cite` and `.u-mono` are gone.

## Content

Against the live v3 site, 127 lines of text are gone from the local build, and
every one is intended:
- **Hero:** the old eyebrow, the cited headline, the lede, the Sources strip and
  the evidence card.
- **Home page explainer:** the HireLens demo, which is still on
  `/work/hirelens/`.
- **Labels:**
  - the section numerals
  - "Selected work" → "Projects", "Also built" → "More projects"
  - "Capabilities" → "Skills", "Proof" → "Used in"
- **Removed outright:**
  - the certifications
  - the clock
  - the "Contact" nav item and section heading (the footer is the contact now)
- **Wording:**
  - "amber" → "orange" in the diagram legend
  - the breadcrumbs and JSON-LD now say "Projects"

Every page title is unchanged.

## Decisions, with the alternative each beat

- **Palette A (paper and signal orange)** over cobalt (safe but generic) and pure
  black and white (no colour for links). Three of the owner's eight reference
  sites use warm paper with near-black ink, and the most common accent is orange.
- **Light by default, dark kept** behind the toggle, over dropping it: the review
  preferred light, and the owner's references are mostly dark.
- **No animation library.** The subtle set (rise-in reveals, the diagram draw,
  card previews, page transitions) needs only CSS and an IntersectionObserver,
  so GSAP, Lenis and OGL went: 75 kB → 2.2 kB.
- **Per-film buttons over a site-wide toggle.** The films are the only motion
  that runs on its own for more than 5 seconds, so the control sits on them.
- **Education as its own section,** after Experience, over a side card in About:
  the owner's call after the first draft.

## Needs your input

1. **Review the draft PR** and click through it locally (`npm run preview`, or
   the LAN preview on your phone).
2. **Show UserA** the new home page. It answers each point of the review.
3. **Release:** mark the PR ready and merge it. Merging deploys v4 to
   abhayemekar.me. Then tag it:
   `git tag -a v4.0.0 -m "v4: the readable redesign" && git push origin v4.0.0`.
