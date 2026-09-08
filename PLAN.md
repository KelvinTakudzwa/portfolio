# Portfolio — Build Plan

**Owner:** Takudzwa Kelvin Mukaro (TeeKay)
**Status:** Content-first pass in progress
**Last updated:** 2026-09-07

## Positioning

"I build systems that watch things nobody else is watching" — embedded sensing,
ML diagnostics, and full-stack delivery, applied to problems that don't have
convenient infrastructure (off-grid solar equipment, artisanal miners with no
smartphone or clinic access).

Primary goal: **general professional presence + active job hunting** (both).

## Visual direction — Industrial telemetry / SCADA HUD

- Full interactive 3D (R3F/Three.js), executed with restraint — an operational
  telemetry feed, not a theme-park scene.
- Monochromatic grid base, stark green/amber pulse-line accents. No stylized
  low-poly game aesthetic.
- Landing: detect device/connection quality. Split HUD layout — terminal-style
  panel on one side, interactive 3D telemetry grid on the other — OR an
  always-reachable text drawer that never traps the user inside the 3D view.
  No forced "boot into 3D, then maybe escape" gate.
- **Node cap: 4 core nodes** in the 3D scene (see below). Every other project
  is indexed in a terminal/archive list, not scattered in 3D.

## Execution priority (locked)

1. **Flagship copy & diagrams** — write real case-study content first.
2. **Responsive HTML shell** — fully usable site with zero 3D, real content,
   real navigation. This is the fallback and the accessible baseline.
3. **R3F scene integration** — layer the 3D telemetry view on top of the
   working shell. If it breaks, degrades, or runs slow, the shell still works.

## The 4 core nodes

1. **Solar Mini-Grid ML Diagnostics** (dissertation) — embedded + ML flagship.
2. **SilicaGuard** (Cimas Healthathon 3.0, 1st place, $3,500 / 372 submissions,
   28 Aug 2026) — health-tech + award flagship.
3. **Sales Overview Power BI Dashboard** — data/BI breadth (star schema, DAX,
   Power Query, budget-vs-actual).
4. **CloudKitchen** — full-stack breadth, real deployed product (Vue/TS) built
   for use at CUT.

Considered and deferred: Agriculture_Management_System (repo currently too
thin — no README content, 6 commits; revisit if fleshed out).

### Archive / terminal index (secondary projects)

shade_zw, cut_dating_app, Employee_Attendance_System, VerifyMe,
weatherdashboard, Agriculture_Management_System, ERP/school_erp,
elevate-customer-hub, Airflow/DAG_CREATION experiments.

## Open items — need TeeKay's input

- [x] SilicaGuard: teammate names/roles — Panashe M. Chandiwana (AI &
      Backend Engineer), Gabriel (Clinical Lead/Research/Pilot), you
      (Mobile, Web & Design Engineer) — confirmed from the team repo
      (github.com/Gabrielpanashe/silica-guard, 114 commits)
- [x] SilicaGuard: your specific contribution — mobile app (React
      Native/Expo, offline-first) + web dashboard + design, confirmed
- [x] SilicaGuard: build status — real, shipped system, not just a pitch;
      repo shows working backend/mobile/dashboard with deliberate scope
      cuts (X-ray AI, WhatsApp, QR codes all dropped under deadline
      pressure) — this is now framed as a strength in the case study
- [ ] SilicaGuard: confirm ok to quote the original pitch deck's named
      doctor and specific impact-projection numbers verbatim (deck is
      marked confidential; repo itself is public and unmarked)
- [ ] SilicaGuard: ok to link the team repo (on Gabriel/Panashe's account)
      from your portfolio?
- [ ] Solar Mini-Grid Diagnostics: any metrics we can publish (accuracy,
      precision/recall, false-positive rate, dataset size, latency) beyond
      what's already in the repo/dissertation abstract
- [x] CV/transcript/certificates supplied (`src/files/`) — extracted:
      Vice Chancellor's Award, GPA 3.0 (A-), full work history (Kaributech-AI,
      Petrotrade), Tuckshop Management System details (merged into the
      CloudKitchen node — **please confirm this is the same project as the
      CloudKitchen repo and not a separate thing**), weatherdashboard's real
      stack (Kafka → MySQL, built during the Kaributech-AI internship)
- [x] Media assets placed: `public/images/capping.jpg` (About page hero),
      `healthathon-cheque.jpg` + `silicaguard-certificate.jpg` (SilicaGuard
      project page gallery)
- [ ] **CV.pdf itself not found in `src/files/`** — only the license,
      transcript, certificates PDFs and two award photos were there. Need
      its location to wire up an actual "Download Resume" link.
- [ ] **Not publishing, by default — flag if you disagree:** the driver's
      license PDF (government ID — real fraud/identity risk if public), the
      ZIMSEC O/A-level certificates PDF (carries a commissioner-of-oaths'
      personal cell number plus verification QR/serial codes), and the raw
      university transcript PDF (registrar seal/signature, reg. number).
      The facts from all three are already written into the site as prose;
      the scans themselves stay off `public/`.
- [ ] Domain name preference (or ship on Vercel subdomain first)
- [ ] Canva connector — still not visible from this session; confirm it shows
      "Connected" in claude.ai → Settings → Connectors, then try a fresh
      session

## Stack

Next.js + TypeScript + Tailwind, React Three Fiber for the telemetry scene,
Framer Motion for shell-level motion, deployed on Vercel.

## Phases

1. Scaffold Next.js project, design tokens (SCADA color system, type scale).
2. Build responsive HTML shell: nav, hero (no 3D yet), 4 flagship case-study
   pages, archive/index page, about, contact.
3. Wire real content (this file's case studies + confirmed open items).
4. Layer R3F telemetry scene on the shell; verify graceful fallback path.
5. Polish: motion, accessibility, performance, responsive, dark/light.
6. Deploy + connect domain.
