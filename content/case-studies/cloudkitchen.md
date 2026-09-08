# CloudKitchen

**Node:** 04 · Core · Full-stack breadth

## One-line

A virtual canteen platform for CUT, letting food vendors sell and reach
students without a physical storefront.

## Problem

Campus food vendors are limited by physical queue capacity and foot traffic;
students have limited windows between classes to queue. A virtual ordering
layer expands a vendor's reach beyond who happens to walk past.

## Approach

A Vue 3 + TypeScript SPA (Vite build), with server-side code for order/vendor
handling. Standard dev/prod workflow (`npm run dev` / `npm run build`),
ESLint-enforced code quality.

## Stack

Vue.js · TypeScript · Vite · Node.js (server-side) · ESLint

## Why it's here

Deliberately the "shipped, real-context product" node, built for actual use
at your own university rather than a tutorial clone, showing full-stack
delivery independent of the ML/embedded work.

## TODO before publishing

- [ ] Is it actually live/used at CUT, or built-and-shelved? Framing depends
      on this
- [ ] Payment handling: real integration or mock/manual?
- [ ] Screenshots of the actual UI
- [ ] Vendor/admin side: does it exist, or is this student-facing only?
