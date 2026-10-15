# Final report: the abhayemekar.me overhaul

All seven phases of [`PORTFOLIO_BRIEF.md`](PORTFOLIO_BRIEF.md) ran from 2026-10-14
to 2026-10-15. Every number below was measured on the production build (`npm run
build && npm run preview`) unless it says otherwise. Nothing is pushed yet. The
commands for that are at the end.

## Before and after

| | Before (Phase 0) | After |
|---|---|---|
| Pages | 1 | 5 + a prerendered 404 |
| Lighthouse mobile, median of 3 | `/`: 95 / 100 / 100 / 100 | **every page 100 / 100 / 100 / 100** |
| Lighthouse desktop | 100 × 4 | 100 × 4 on every page |
| LCP, mobile | 2.42 s (81% waiting on React) | **1.65–1.66 s** |
| CLS · TBT | 0.026 · 18 ms | **0 · 0 ms** |
| Interaction latency, 4× CPU throttle (INP basis) | not measurable (nothing interactive) | criterion 14–49 ms · blind review 10–43 ms · theme 52–182 ms |
| JavaScript per page (gzip) | 99.0 kB | **1.4 kB**, plus a 0.5 kB explainer chunk on two pages |
| CSS (gzip) | 5.7 kB | 7.0 kB |
| Fonts | 128.4 KiB (4 files) | **96.2 KiB** (2 files) |
| Page weight, `/` | 240.6 kB | **124 kB** |
| Words in the raw HTML (what crawlers, link previews and LLMs see) | **0** | 1,687 on `/`; 511–1,373 per case study |
| Words on the home page (visible) | 1,739 | 934 |
| Words before the first project | 588 | 69 |
| Selected work on a 360px phone | 4,744 px (screen 6) | 1,278 px (screen 2) |
| axe-core | 0 violations (1 page) | **0 violations**: 6 pages × 2 themes × 360 / 1280px |
| Keyboard | 30 stops | 156 stops across the site, all with a visible focus ring |
| Smallest text | 11 px | 13 px |
| Worst text contrast | 4.71:1 (404 page: 3.66, fail) | 5.48:1 ([table](CONTRAST.md)) |
| Share card | one card, said "SOFTWARE ENGINEER" | one per page, in the site's real fonts |
| Structured data | Person | Person, WebSite, ProfilePage; SoftwareSourceCode or SoftwareApplication plus a breadcrumb per case study |
| Measured numbers on the site | 1 (3-Factor Login) | 3 (+ HireLens npm downloads, SearchScribe and ForecastGPT test counts), each with a source |
| `npm audit` | 2 high (build-time) | 0 |

## Screenshots

- Before: [`screenshots/phase-0/`](screenshots/phase-0/), the original site at four
  widths, plus JS-off (a blank page).
- After: [`screenshots/final/`](screenshots/final/), the home page at
  360/768/1280/1920 in both themes, full pages, reduced motion and JS-off.
- Along the way:
  - [`phase-1`](screenshots/phase-1/): both design directions
  - [`phase-3`](screenshots/phase-3/): every case study
  - [`phase-4`](screenshots/phase-4/): the explainer
  - [`phase-5`](screenshots/phase-5/): the 404 page

## How each check was run

- **Lighthouse:** `npx lighthouse@12`, mobile and `--preset=desktop`, three runs
  per page, median reported.
- **axe-core 4.14.0:** wcag2a/2aa/21a/21aa/22aa/best-practice, injected into
  headless Chrome after scrolling the whole page.
- **Interaction latency:** two methods. Real CDP mouse input with the Event
  Timing API, and in-page click-to-next-frame timing. The Event Timing durations
  for blind review in headless Chrome (about 1.2 s) turned out to be an
  artifact: a performance trace showed no task over 20 ms, and in-page timing
  measured 10–43 ms. The theme toggle was genuinely slow (260–740 ms at 4×),
  because every colour transition started at once. It was fixed by suspending
  transitions for the switching frame.
- **Links:** every internal `href` and `#anchor` in `dist/` resolves (0
  failures).
  - External: 42 URLs. All 32 GitHub links (every repo file a case study cites)
    return 200 on `main`.
  - npm and LinkedIn block automated requests and work in a browser.
  - The ForecastGPT live app takes about 42 s to wake, which the link label says.
- **Keyboard walk-through, home page:**
  1. Skip link.
  2. Name, then Work, About and Contact, then the Dark theme toggle.
  3. The hero citation "1", then the primary CTA, then Email me, then "All six
     criteria" on the hero card.
  4. The proof strip links.
  5. Per project: Read the case study, then its links.
  6. The explainer: Blind review, the six criteria (Enter or Space selects one),
     then the scrollable resume region.
  7. The "Also built" rows, the capability proof links, the LinkedIn
     certifications link.
  8. Contact: email, GitHub, LinkedIn.
  9. Back to top.

  No stop is hidden, and none sits under the sticky nav.
- **Privacy:** no phone pattern, `tel:`, `streetAddress`, `postalCode` or
  `telephone` in `src/`, `dist/` or any commit on any branch. The only matches
  are docs stating the rule.

## Decisions, with the alternative each beat

| Decision | Over | Why |
|---|---|---|
| Position on "AI systems that show their work" | A generic "full-stack AI engineer" line | It's the pattern already in HireLens, SearchScribe, ForecastGPT and REFLEX-AI, so the site can prove it rather than claim it |
| Direction A, "Evidence" (an evolution of Ink & Amber) | Direction B, "Systems" (a fresh grotesk/grid look) | The design enacts the claim: amber marks evidence, and the explainer uses the same marks. B is closer to a common dev-tool look |
| Home page plus four case-study pages | One long page | Shareable URLs, a share card per project, crawlable depth, and a shorter home page |
| React at build time only; no hydration | Prerender plus `hydrateRoot` (the brief's first choice) | Nothing needed client React. JS went from 99 kB to 1.4 kB, and hydration mismatches are impossible by construction |
| CSS-only motion; `motion` removed | Keeping the animation library | "Mark, don't move": no entrance animations, so the LCP text paints in the first frame |
| Newsreader, wght-only file | The opsz file (132 KB per style) | It fits the 130 KiB font budget with room to spare |
| Explainer data from the live demo (production engine) | A local-model run | The laptop can't run a 7B model, and production output is the more honest proof |
| HireLens benchmark: method only for launch | Publishing local 3B-model numbers | llama3.2:3b broke the scoring schema. Numbers come only from a live run (command below) |
| Share cards screenshotted in Chrome | librsvg (sharp) | librsvg can't load web fonts |
| Prerendered 404 | The standalone 404 file | Same fonts and tokens, and it no longer fails contrast |
| No analytics | GoatCounter / Cloudflare Web Analytics | The owner's rule, and the footer says "No tracking". Both options are cookieless if that changes |
| Not building the "ask about my work" assistant | A client-side retrieval UI or an LLM endpoint | The explainer already carries the AI proof. An assistant would add a service or JS for little gain |

## Needs your input

Resolved on 2026-10-15:

- **Resume.** `public/resume.pdf` is Abhay's own resume.
  - Only its document properties changed: the Author in both the Info dictionary
    and the XMP `dc:creator` was a template author's name and is now his.
  - The text and all 12 links are byte-for-byte unchanged.
  - The phone number is kept by his choice. CLAUDE.md records it as the single
    exception to the privacy rule.
- **The five lines** were written from his own published sources:
  - Translytics: his resume.
  - About: the education record on this site.
  - HireLens next: its README roadmap, plus the CI benchmark gap.
  - SearchScribe next: its README beta status.
  - yDirect next: its public roadmap.

  The build now reports 0 TODOs.
- **The `www.` certificate.** The custom domain was re-saved in Pages
  settings, the DNS check passed, and a certificate was being provisioned when
  this was written.

Still open:

1. **HireLens benchmark (optional).** In PowerShell, from
   `C:Playgroundhirelens`. It writes `packages/eval-report.json` in that repo,
   and the key stays in your shell:
   ```
   $env:HIRELENS_LLM_PROVIDER="google"; $env:HIRELENS_LLM_MODEL="gemini-2.5-flash"; $env:HIRELENS_LLM_API_KEY="<your key>"; pnpm --filter @hirelens/evals run evals
   ```
2. **Resume wording (optional).** Two claims go further than the code does:
   - HireLens: "CI evals" (CI runs the unit tests, not the benchmark).
   - ForecastGPT: "schema-enforced JSON" and "grounds every claim".
3. **HireLens docs drift (separate repo).**
   - The README says the evals are "wired into CI".
   - The blind-review docs say "read time" and mention schools.
   - The docs disagree on the Ollama base URL (it needs `/v1`).
   - There's no minimum-model note for local scoring.

## Suggested tag

**`v2.0.0`.** A new information architecture (new URLs under `/work/`), a new
rendering model and a new design system: a breaking change from the 1.0.0 site.
Tag it after the deploy is verified (commands below).

## Branches and push commands

Each phase is a branch cut from the one before, so they stack in this order,
and `chore/quality` contains everything:

```
main → docs/audit → docs/strategy → feat/foundation → feat/content → feat/signature → feat/seo → chore/quality
```

`main` hasn't moved since the work began, so it fast-forwards. Pushing `main`
deploys the site.

```bash
git push -u origin docs/audit docs/strategy feat/foundation feat/content feat/signature feat/seo chore/quality
```

```bash
git checkout main
```

```bash
git merge --ff-only chore/quality
```

```bash
git push origin main
```

Then check https://abhayemekar.me once the Actions deploy finishes, and tag it:

```bash
git tag -a v2.0.0 -m "Portfolio overhaul: prerendered case studies, Evidence design, HireLens explainer"
```

```bash
git push origin v2.0.0
```

If you'd rather review it as pull requests, push the branches (the first
command), then open one PR per branch, each targeting the branch before it,
and merge them in the order above.
