# v4 plan: from showreel to a page you can scan

Draft for approval, 2026-10-27. Source: the review with UserA on 2026-10-22
(the written notes; the audio itself wasn't transcribed). Nothing here is built
yet.

## What the review is really saying

v3 was modelled on design-studio sites, and it reads like one: a giant
name, posters at display size, a choreographed scroll. UserA read it the way a
recruiter or hiring manager does, and asked for four things:

1. **The role first.** "Full-stack AI Engineer" should be the biggest thing on
   the first screen, not the name.
2. **Readable small text.** 13px uppercase mono with letter-spacing is hard
   to read.
3. **Less scrolling.** Four projects take about four screens; five capabilities
   take two.
4. **Light, plain and always reachable:** a light page, with LinkedIn, GitHub
   and the resume in the header at all times.

v4 keeps the content, the case-study pages, the prerendered HTML, the budgets,
the accessibility work and the "show their work" idea. It changes the
presentation.

## Colour

### What the reference sites actually use

Measured from the live pages (computed styles):

| Site | Canvas | Text | Accent |
|---|---|---|---|
| cappen.com | `#fcfcfc` near-white | `#000` | none: black and white only |
| brandappart.com | `#fbf9ef` warm paper | `#171412` warm ink | `#ff7722` orange |
| mildsugardesign.jp | `#f7f5f1` warm paper | `#3c3728` brown-black | `#fea831` orange |
| alche.studio | `#000` | `#fff` | `#d7ff00` lime |
| productionportugal.com | `#000` | `#fff` | `#ff0080` magenta |
| codeandchill demo | near-black | light grey | `#ff5c3d` orange-red |
| jesperlandberg.com (added 2026-10-27) | `#000` | `#fff` | none: colour comes from the project shots |
| noth.in (added 2026-10-27) | `#000` and `#fff` sections | inverted to match | none: colour comes from the project shots |

**What all eight share:**
- **The base is monochrome**, light or dark, and never a coloured
  background.
- **They use at most one accent.** Orange is the most common (three sites),
  and three use none.
- **Most of the colour comes from the work's own imagery.**

**The two newest add:**
- **Compactness.** Jesper Landberg's whole home page is one screen, and the
  work is a carousel.
- **Restraint.** Noth.in shows the work as large shots, each with a one-line
  tagline.

**What they don't support:** both are dark, and their text is 8–11px. Those
are the two things UserA flagged. So v4 takes their compactness and restraint,
not their darkness or their type sizes.

### Recommendation: A, paper and signal orange

| Token | Value | Contrast on paper |
|---|---|---|
| `bg` | `#faf8f3` | — |
| `bg-elev` (cards) | `#ffffff` | — |
| `fg` | `#171412` | 17.3:1 |
| `fg-muted` | `#4d4842` | 8.5:1 |
| `fg-subtle` | `#68625a` | 5.7:1 |
| `accent` (text, button hover) | `#b4410c` | 5.3:1 |
| `mark` (underlines, rules, dots) | `#e85d14` | 3.3:1 (non-text, needs 3:1) |
| `wash` (evidence highlight) | `#ff6a1f` at 18% | `fg` on it 14.4:1 |

Why A:
- **It comes from your own references.** It's Brand Appart's and Mildsugar's
  palette, adapted for AA text. Like all eight, it's a monochrome base with
  one sparing accent, so the project posters bring most of the colour.
- **The evidence idea carries over.** The amber evidence highlighter becomes an
  orange one, with the same rules about where colour may appear.
- **It isn't the default AI-portfolio look**, which is blue or purple on white.

Alternatives (both AA, shown in the chat mockup):
- **B, paper and cobalt** (`#f7f8fa` / `#11151c` / `#1d4ed8`): the safest,
  most corporate option, but the least memorable.
- **C, monochrome and highlighter** (Cappen's black and white, plus a yellow
  `#ffd60a` highlight for evidence only): the most editorial, but links
  get no colour. It's the closest match to Jesper Landberg and noth.in.

**Default theme: this is the real tension.** UserA prefers light. Five of your
eight references are dark. My recommendation is light by default, with a dark
version of A behind one small toggle (`#121110` / `#f3efe8` / `#ff8a4c`, all
AA). A dark-first site would be possible too, but it's the opposite of what the
review asked for. **Decision 2.**

## The home page, section by section

New order: header → hero → About → Projects → Experience → Skills → footer.

| Section | Now | v4 |
|---|---|---|
| **Header** (sticky) | Name, "Pune 17:55 IST", Work / About / Contact, theme toggle. Hides on scroll down | Name (small), Projects / Experience / About, then **GitHub, LinkedIn, Resume** as icons with text labels from 1024px and icon-only on phones, then the theme toggle. Always visible: no hide on scroll, no clock, no city |
| **Hero** | Eyebrow, full-width particle name, "Pause motion", the "show their work" h1, lede, CTAs, the Sources strip, the HireLens evidence card | One `<h1>`: "Abhay Yemekar" on a small line, **"Full-stack AI Engineer"** large below it. Then one line: "I build AI systems that show their work", with the highlight. Buttons: View projects, Email me. Fits in about 60% of a laptop screen, so the next section shows above the fold. The Sources strip and evidence card go |
| **About** | 5th of 6. A giant serif-italic statement whose words light up on scroll, then the story, with education beside it | Directly after the hero. "I like building things that actually work" becomes the opening sentence at normal size. Two short paragraphs, with education and three certificates in a side card. **Decisions 3, 4** |
| **Projects** | "Selected work". One project per screen: 84px titles, a poster, and the HireLens explainer below the list | **"Projects"**, with "4 case studies" at 15px. A 2×2 card grid (one column on phones): poster, name at 24–28px, the trust-pattern line, one-sentence summary, dates, links. Hovering a card plays its preview in place. **The HireLens explainer leaves the home page.** It's already on `/work/hirelens/` |
| **More projects** | "Also built", its own section: 5 rows at 36px | Renamed **"More projects"** and moved inside Projects as a compact two-column list: name, a 16px tagline, a 14px period |
| **Experience** | The company as a 56px heading; title and dates in 13px mono; a sticky column | A vertical timeline: dates on the rail. The **role is the heading** (about 22px), with the company and arrangement below it at 16px. Bullets and the Mahindra client block stay, more compact |
| **Skills** | "Capabilities": 5 full-width rows, each about 200px tall, with the proof as small links at the bottom | **"Skills"**: 5 cards in a 3 + 2 grid, about one screen. Each card has the label, one line on what it covers, the tools as small tags, and a **"Used in"** row whose project names are the links. The evidence sits next to the claim |
| **Contact + footer** | A Contact section with a giant email, then a footer with the name at 136px | **One compact footer** (`id="contact"`): "Open to AI engineering roles", the email link, GitHub / LinkedIn / Resume, and © year. The name appears only in the header, the hero and the © line |

## Typography

| Use | Now (max) | v4 |
|---|---|---|
| Hero h1, the role | 84px | 40–64px, the largest text on the page |
| Name above it | 240px particle field | about 20px |
| Section headings | 96px | 28–36px |
| Project names | 84px | 24–28px |
| Experience role, skill label | 56px | 20–22px |
| Body | 17px | 17px (unchanged) |
| Meta: dates, counts, tags | 13px uppercase mono, letter-spaced | **14–15px sentence-case sans** |

- **Headings:** Instrument Sans at normal width, replacing the 80% condensed
  poster cut. Instrument Serif Italic stays only for the one highlighted clause.
- **Bracketed labels:** `[ 01 ]` and the section numerals go.
- **Mono:** JetBrains Mono stays only where text is code-like (the HireLens
  explainer's offsets). The home page may then need no mono font at all, which
  saves about 40 KB.

## Motion

| Keep | Remove |
|---|---|
| A short rise-and-fade as sections enter, played once | The particle name (the OGL chunk) |
| The view transition from a project card to its case-study title | The first-visit intro, Lenis smooth scroll, the cursor ring, the magnetic button |
| Hover previews, now inside the cards | Nav hide-on-scroll and the label scramble |
| The explainer's evidence sweep (case page) | The About word-lighting, the footer letters, the showcase scale |
| | **The "Pause / Play motion" button** |

**Removing the button stays within WCAG 2.2.2.** A pause control is needed
only for motion that starts by itself and runs longer than 5 seconds. Without
the particles, the only looping things are the case-study films, and each film
gets its own small pause button.

**Reduced motion now simply follows the OS setting.** Your own Windows has
animations off, so on that machine you'll see the still version unless you turn
them on.

**The JS gets smaller.** The motion layer is about 74 kB today. Most of what
stays can be CSS plus a small IntersectionObserver. Whether GSAP stays at all
depends on the case-page diagram draw, and I'll measure that in Phase 3.

## Shared pieces and the case-study pages

- **Case pages and the 404** take the new tokens and type scale automatically.
  Each case page gets the same header and footer, a smaller title, and the
  per-film pause buttons in place of the motion toggle.
- **Share cards** (`npm run gen:og`) are regenerated light. Check the favicon
  monogram against the new palette.
- **No new dependencies.** The GitHub and LinkedIn glyphs are inline SVG in
  `Icons.tsx`.
- **Unchanged:** the data files' content, the case-study text, JSON-LD
  (except that the hero text changes), privacy rules, the build gate and the
  budgets.

## Phases

Branch `redesign/v4-readable` from `main`, shipped through a draft PR like v3.

1. **The first screen:** tokens (palette and type), header, hero and the
   projects grid. **Checkpoint:** screenshots at 390 and 1440 for you, and
   UserA if you like, to approve before the rest.
2. **The rest of the home page:** About and education, Experience, Skills and
   the footer. Remove the dropped sections and their client code.
3. **Case pages, 404, share cards, favicon;** slim the motion layer.
4. **Quality:**
   - the build gate
   - axe with 0 violations
   - Lighthouse 95+ in all four categories on both form factors
   - the contrast table re-measured
   - a content diff, with its expected removals listed
   - `CLAUDE.md` and a V4 report rewritten

   Then the draft PR. You merge.

## Decisions needed

| # | Question | Recommendation |
|---|---|---|
| 1 | Palette | **A**, paper and signal orange |
| 2 | Default theme | Light by default (the review), with dark behind one small toggle (your references) |
| 3 | Where About goes | Right after the hero |
| 4 | Education | A side card inside About, not its own section |
| 5 | The "I build AI systems that show their work" line | Keep it as the one-line subtitle under the role |
| 6 | Motion | The subtle set above |
| 7 | Headings | Projects · More projects · Experience · Skills · About |
| 8 | "The extra HireLens section" in the review | The HireLens explainer below the four projects. Confirm |
