# One-Day Demo Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve the existing desktop demo MVP within one day by making input, regeneration, failure recovery, and smoke verification feel presentation-ready.

**Architecture:** Keep `app/page.tsx` thin and continue using `src/features/demo/DemoPlanner.tsx` as the client container. Reuse the existing trip contracts and API client, adding only local UI helpers for duration/style/member editing so the backend contract remains unchanged.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Zod contracts, Vitest + React Testing Library, Playwright smoke verification

---

### Task 1: Editable Trip Conditions

**Files:**
- Modify: `src/features/demo/DemoPlanner.test.tsx`
- Modify: `src/features/demo/DemoPlanner.tsx`
- Modify: `app/globals.css`

- [x] Write failing tests for duration selection, style toggling, and member preference editing.
- [x] Implement duration option controls using exact values from `tripDurationSchema.options`.
- [x] Implement travel style controls using exact values from `travelStyleSchema.options`.
- [x] Implement lightweight member name/likes/dislikes editing with add/remove actions.
- [x] Verify focused UI tests pass.

### Task 2: Better Demo Recovery

**Files:**
- Modify: `src/features/demo/DemoPlanner.test.tsx`
- Modify: `src/features/demo/DemoPlanner.tsx`
- Modify: `app/globals.css`

- [x] Write failing tests for retrying after generation failure and regenerating from an existing result.
- [x] Add explicit retry/regenerate actions that reuse current conditions.
- [x] Keep generated result visible until a new generation succeeds when regenerating.
- [x] Verify focused UI tests pass.

### Task 3: Smoke Test And Docs

**Files:**
- Create: `tests/e2e/demo-polish.spec.ts`
- Modify: `docs/handoffs/demo-mvp-ui.md`
- Modify: `todo.md`

- [x] Add a Playwright smoke test for input edit -> generate -> share -> shared lookup.
- [x] Update handoff and todo with the one-day polish scope and verification.
- [x] Run `npm.cmd run test`, `npm.cmd run lint`, `npm.cmd run typecheck`, `npm.cmd run build`, and `git diff --check`.
- [x] Commit and push the branch.
