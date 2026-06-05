# Place Route Adapters Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add testable place search and route duration adapter boundaries backed by Google Places Text Search (New) and Google Routes computeRoutes.

**Architecture:** Define provider-neutral place and route interfaces first, then implement Google adapters using injected `fetch` and API keys. Keep field masks explicit to control latency and billing, and return normalized data that the later AI itinerary generator can consume without knowing Google response shapes.

**Tech Stack:** TypeScript, Zod, Vitest, Google Places API (New), Google Routes API

---

### Task 1: Provider Contracts With TDD

**Files:**
- Create: `src/features/places/place-provider.ts`
- Create: `src/features/places/place-provider.test.ts`

- [x] Write failing tests for destination category queries and fallback adjacent searches.
- [x] Implement provider-neutral types and helper functions.
- [x] Run focused tests.

### Task 2: Google Places Adapter With TDD

**Files:**
- Create: `src/features/places/google-places-provider.ts`
- Create: `src/features/places/google-places-provider.test.ts`

- [x] Write failing tests for Text Search request shape, field mask, normalized response, and API failure.
- [x] Implement the Google Places adapter with injected fetch and explicit field mask.
- [x] Run focused tests.

### Task 3: Google Routes Adapter With TDD

**Files:**
- Create: `src/features/routes/route-provider.ts`
- Create: `src/features/routes/google-routes-provider.ts`
- Create: `src/features/routes/google-routes-provider.test.ts`

- [x] Write failing tests for computeRoutes request shape, field mask, duration parsing, and no-route failure.
- [x] Implement the route provider and Google Routes adapter.
- [x] Run focused tests.

### Task 4: Documentation And Verification

**Files:**
- Create: `docs/contracts/place-provider-adapter.md`
- Create: `docs/handoffs/place-route-adapters.md`
- Modify: `docs/collaboration/work-board.md`
- Modify: `todo.md`

- [x] Document adapter contracts, environment variables, field masks, and failure behavior.
- [x] Run full test, lint, typecheck, and build verification.
- [x] Commit and push the feature branch.
