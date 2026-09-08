# SilicaGuard

**Node:** 02 · Core · Award
**Status:** content complete, repo-verified, one small confidentiality note left (see TODO)
**Repo:** github.com/Gabrielpanashe/silica-guard (team repo, 114 commits)

## One-line

A working occupational-lung-health screening system for Zimbabwe's artisanal
gold miners: offline mobile app, USSD/SMS for feature phones, a clinical
dashboard, built and shipped in weeks for Cimas Healthathon 3.0. 1st place.

## The result (confirmed)

- **1st position**, Cimas Healthathon 3.0, awarded 28 Aug 2026, Harare
- **US$3,500** prize, selected from **372 submissions** down to 10 finalists
- Team: **Panashe M. Chandiwana**, AI & Backend Engineer · **you
  (Takudzwa)**, **Mobile, Web & Design Engineer** · **Gabriel**, Clinical
  Lead, Research & Pilot Lead

## Problem

Silicosis, permanent, incurable lung scarring from silica dust, is killing
Zimbabwe's artisanal gold miners at a rate a Kwekwe district hospital
superintendent has publicly called unacceptable: roughly one death a week at
a single hospital. A population of 500,000–1.5 million artisanal miners has
**zero existing digital screening infrastructure**: no way to self-assess,
no field triage tool, no early-warning system between first exposure and
hospital-stage disease.

## What actually got built

This is real engineering under a deadline, not a slide deck: the repo shows
deliberate scope cuts as the problem got clearer, which is worth stating
plainly because it's the more interesting story than "we shipped everything
we planned":

- **Chest X-ray AI dropped**: hardware and regulatory barriers made it
  impractical in the timeframe
- **WhatsApp channel dropped**: assumed smartphone ownership the target
  population doesn't reliably have; replaced with **SMS** delivery and
  reminder cascades
- **QR referral codes replaced with typed codes** (`SG-4K7Q` format): QR
  scanning assumed hardware/literacy the field context couldn't guarantee
- **Enterprise/formal-sector targeting dropped** (pivoted 5 Aug) to focus
  exclusively on artisanal miners, the harder, higher-need population
- **4-week WhatsApp education sequence** replaced with point-of-screening
  advice, delivered when it's actually actionable

## Architecture (as shipped)

**Backend**: FastAPI + SQLAlchemy, PostgreSQL via Supabase in production
(SQLite for local dev). Africa's Talking integration for USSD and SMS via
direct `httpx` calls.

**Mobile (my primary piece)**: React Native + Expo, offline-first via
`expo-sqlite`. A ~10-minute field assessment flow a health worker runs at
the mine site with no connectivity required.

**Dashboard (my primary piece)**: deliberately static HTML/CSS/JS deployed
to Render, not the originally planned React + Vite + Recharts + Leaflet
build, a pragmatic call under time pressure that still delivers population
intelligence to clinical/insurer stakeholders.

**AI**: Google Gemini 2.5 Flash across four distinct modules (risk
stratification, longitudinal comparison, referral logic, report generation),
with the Claude API documented as a drop-in alternative.

**Core features implemented:**
- Four-tier risk stratification (GREEN / YELLOW / ORANGE / RED)
- **Longitudinal deterioration detection**: compares a miner's current
  screening against their prior results, not just a single-point snapshot
- Smart referral routing with tracked workflow and human-readable codes
- USSD self-screening, including a web simulator for demoing/testing it
  without live telco integration
- SMS result delivery and reminder cascades
- **Outreach Planner** with auto-generated post-visit reports
- Clinical web dashboard with population-level intelligence

## My role

Mobile, web, and design engineer on the team: the React Native/Expo field
app and the clinical dashboard were my primary pieces, alongside the overall
design language across both. Panashe owned the AI risk engine and backend;
Gabriel drove the clinical protocol, research grounding, and pilot planning.

## Why it matters as a portfolio piece

This pairs with the solar mini-grid project as the site's throughline: one
watches equipment nobody's physically monitoring, the other screens people
nobody's systematically reaching, both by building for the infrastructure
the target actually has (a $10 ESP32; a feature phone on USSD) instead of
the infrastructure a nicer proposal would assume. The scope cuts above are
arguably the strongest evidence of engineering judgment on the whole site:
recognizing X-ray AI and WhatsApp were the wrong bets for this context, and
cutting them under deadline pressure rather than shipping something that
looks impressive in a pitch but doesn't survive contact with a mine site.

## TODO before publishing

- [ ] The original Healthathon pitch deck is marked "Confidential Innovation
      Submission" and quotes a named doctor directly. The *repo* itself is
      public with no such marking, so the built-system description above is
      safe to publish as-is; just confirm with Panashe/Gabriel before
      quoting the doctor or citing the specific impact-projection numbers
      from the pitch deck (19%, 20–30% admission reduction, etc.) verbatim
- [ ] Confirm whether to link the team repo directly from your portfolio
      (it's on Gabriel/Panashe's account, not yours) or just reference it
- [ ] Any screenshots of the actual mobile app or dashboard UI to use
      instead of/alongside the cheque-presentation photo
- [ ] Current status: still active post-Healthathon, or paused?
