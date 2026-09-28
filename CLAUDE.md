# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Personal portfolio site for Takudzwa Kelvin Mukaro ("TeeKay"): Next.js 14 (App Router) + TypeScript + Tailwind CSS, deployed on Vercel. Visual identity is a dark industrial-telemetry/SCADA HUD aesthetic (monochrome grid, green/amber pulse accents, glass panels, scanlines) — see `PLAN.md` for the full positioning/design brief and the locked execution order (content → HTML shell → optional 3D layer, which hasn't been built yet; the site currently runs entirely on the 2D HTML shell described below).

The repo also contains an unrelated, self-contained sub-project: `job-watcher/` (see below).

## Commands

Run from the repo root (`package.json` here governs the Next.js site):

```bash
npm install
npm run dev      # dev server, localhost:3000
npm run build    # production build
npm run start    # serve the production build
npm run lint     # next lint (extends next/core-web-vitals)
```

There is no test suite configured. `job-watcher/` is a separate npm project with its own `package.json` — see its own commands below.

### job-watcher commands

```bash
cd job-watcher
npm install
DRY_RUN=1 node watch.mjs   # logs what it would send, sends nothing
node watch.mjs             # real run, needs TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID env vars
```

## Architecture

### Content model: two flat data files, no CMS

- `src/lib/projects.ts` — the **4 core "node" projects** shown on the homepage and rendered at `/projects/[slug]`. Each `Project` is a single object: slug, node number, category, title, tagline, stack, stats, an array of `{ heading, body[] }` prose sections, optional `media[]` and `liveUrl`. Adding a project = adding an object to this array; the `[slug]` route, static params, and prev/next nav are all derived from it automatically.
- `src/lib/archive.ts` — secondary/lower-priority projects rendered as a plain table row list on `/archive`. Much lighter shape (`name`, `blurb`, `stack` string).
- `content/` — human-readable markdown drafts of the case studies (`content/case-studies/*.md`, `content/archive.md`). These are the source-of-truth prose that gets hand-transcribed into `projects.ts`/`archive.ts`; **editing a `.md` file here does not change the site** — the corresponding TS object must be updated too. Treat `content/` as an authoring/reference layer, not a data source the app reads at build or runtime.

`PLAN.md` documents the reasoning behind the "4 core nodes" cap (everything else goes to the archive index) and has an "Open items" checklist of unresolved content decisions (unpublished credential scans, unconfirmed metrics, domain name, etc.) — check it before adding/changing project content, since some facts are deliberately withheld from `public/`.

### Routes (`src/app/`, App Router)

- `/` — hero + core-systems grid + achievements strip + skills + about teaser. All data-driven from `projects.ts`.
- `/projects/[slug]` — case-study detail, statically generated via `generateStaticParams()` over `projects`.
- `/archive` — table of `archive.ts` entries.
- `/about`, `/contact` — mostly-static content pages (bios/experience are hardcoded arrays in the page files, not in `lib/`).

### Motion system (`src/components/motion/`)

All animation runs through a small set of shared primitives rather than ad hoc `framer-motion` calls per page:

- `MotionProvider` wraps the app in `<MotionConfig reducedMotion="user">` — this is the *only* global reduced-motion switch for Framer-driven animation; respect it rather than adding per-component media-query checks.
- `Reveal` / `RevealGroup` / `RevealItem` — scroll-triggered fade+rise, with group/item variants for staggered children. Nearly every section on every page is wrapped in one of these three.
- `Readout` — character-by-character stagger reveal, used specifically for stat values (e.g. `$3,500`, `~0.85 F1`) to read like a HUD readout powering on.
- `PageTransition` — route-level `AnimatePresence` cross-fade keyed on pathname, mounted once in `layout.tsx` around `children`.

Canvas-based animation (`NetworkBackground`) and pure-CSS animation (`.scanline`, `.eq-bar`, `.diagram-float`, `.pulse-rule` in `globals.css`) separately check `prefers-reduced-motion` themselves since they sit outside Framer's `MotionConfig`. Keep that duplication in mind if the reduced-motion strategy ever changes — it needs updating in three places (`MotionConfig`, `NetworkBackground`'s own matchMedia check, and the CSS `@media (prefers-reduced-motion: reduce)` block).

### Visual language: custom CSS classes + Tailwind tokens

Design tokens (colors, grid background, keyframes) are defined in `tailwind.config.ts` (`bg`, `panel`, `panel2`, `line`, `line2`, `fg`, `muted`, `dim`, `green`, `amber`, `red`). On top of Tailwind utilities, `src/app/globals.css` defines the recurring HUD motifs as reusable classes, used throughout `src/app/**` and `src/components/**`:

- `.telemetry-grid` — faint grid backdrop
- `.bracket` — corner-bracket frame overlay (via `::before`/`::after`)
- `.glass-panel` — translucent blurred HUD card
- `.scanline` — animated sweep-line overlay
- `.status-dot`, `.nav-link`, `.eq-bar`, `.diagram-float`, `.pulse-rule` — smaller decorative primitives

When building new UI in this style, prefer composing these existing classes over inventing new ad hoc effects, to keep the aesthetic consistent.

Decorative SVG "system diagrams" (`src/components/diagrams/SolarGridDiagram.tsx`, `SilicaGuardDiagram.tsx`) and HUD data readouts (`src/components/HudPanel.tsx`) are hardcoded per-project illustrations floated over the hero on desktop only (`hidden lg:block`) — they are not generated from `projects.ts` data, so a new project doesn't automatically get one.

### job-watcher/ (independent sub-project)

A standalone Node script (`watch.mjs`, ESM), unrelated to the Next.js app, that polls RemoteOK/Arbeitnow/WeWorkRemotely job feeds every 3 hours via a GitHub Actions cron (`.github/workflows/job-watcher.yml`) and Telegram-notifies on new title matches against `keywords.json`, deduping against a committed `seen.json`. It has its own `package.json`/`node_modules` and does not participate in the Next.js build. `vercel.json`'s `ignoreCommand` explicitly excludes `job-watcher` and `.github` from triggering Vercel redeploys. See `job-watcher/README.md` for the full setup/behavior (matching is title-only by design; first run seeds `seen.json` silently rather than notifying on everything already live).

## Content-change guardrails

Several credential/ID documents live in `src/files/` (driver's license, transcript, certificates PDFs) but are deliberately **not** in `public/` and not linked from the site — `PLAN.md`'s open items explain why (personal-data/fraud-risk exposure from scanned government/academic documents). Don't move these into `public/` or link them without re-confirming that decision.
