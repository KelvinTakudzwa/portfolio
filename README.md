# TeeKay Portfolio

Personal portfolio for Takudzwa Kelvin Mukaro. Next.js (App Router) + TypeScript +
Tailwind CSS. See [PLAN.md](PLAN.md) for the full design/content plan and
open items.

## Status

Phase 2 in progress: responsive HTML shell, no 3D yet (per the locked
execution order in PLAN.md: content, then shell, then the R3F telemetry
layer).

## Dev

```bash
npm install
npm run dev
```

## Structure

- `content/`: source case-study drafts (human-readable, feeds `src/lib/projects.ts`)
- `src/lib/projects.ts`: the 4 core node data
- `src/lib/archive.ts`: secondary/archive project index
- `src/app/`: routes (home, `/projects/[slug]`, `/archive`, `/about`, `/contact`)
- `src/components/`: shared Nav/Footer
