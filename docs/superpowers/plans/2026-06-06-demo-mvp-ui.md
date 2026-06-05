# Demo MVP UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a demo-ready desktop MVP flow from trip input to generated result and share lookup.

**Architecture:** Keep `app/page.tsx` and `app/share/[tripId]/page.tsx` thin, with interactive UI in focused client components under `src/features/demo`. Reuse existing trip contracts and API routes so the UI can later be split into richer pages without changing data flow.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Zod contracts, Vitest + React Testing Library

---

### Task 1: API Client Expansion

**Files:**
- Modify: `src/features/trips/api-client.ts`
- Modify: `src/features/trips/api-client.test.ts`

- [x] Add tested `createHttpTripApiClient` with `generateTrip`, `shareTrip`, and `getSharedTrip`.
- [x] Keep existing mock API client for isolated UI tests.

### Task 2: Demo Planner Client UI

**Files:**
- Create: `src/features/demo/DemoPlanner.tsx`
- Create: `src/features/demo/DemoPlanner.test.tsx`
- Modify: `app/page.tsx`
- Modify: `app/globals.css`

- [x] Add tested input -> generate -> result -> share URL flow.
- [x] Use demo defaults to keep the presentation path fast.
- [x] Render route timeline, cost summary, coordinate panel, and safe external links.
- [x] Handle invalid input and generation/share failures.

### Task 3: Shared Result Page

**Files:**
- Create: `app/share/[tripId]/page.tsx`
- Create: `src/features/demo/SharedTripPage.tsx`
- Create: `src/features/demo/SharedTripPage.test.tsx`

- [x] Add tested shared result lookup UI using `GET /api/trips/[tripId]`.
- [x] Render missing/expired share state with a path back to the planner.

### Task 4: Documentation And Verification

**Files:**
- Modify: `README.md`
- Modify: `todo.md`
- Modify: `docs/collaboration/work-board.md`
- Create: `docs/handoffs/demo-mvp-ui.md`

- [x] Run full test, lint, build, typecheck, and diff checks.
- [ ] Commit and push the feature branch.
