# Share Trip Results Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans or
> superpowers:subagent-driven-development to implement this plan task-by-task.

**Goal:** Add temporary shared trip result storage and lookup APIs for generated
trip results.

**Architecture:** Keep storage behind `TripShareStore`. Use Supabase when server
keys are configured and a process-local in-memory fallback for local demo safety.

---

### Task 1: Store Boundary With TDD

**Files:**
- Create: `src/features/shares/trip-share-store.ts`
- Create: `src/features/shares/trip-share-store.test.ts`

- [x] Write failing tests for saving, retrieving, and expiring shared results.
- [x] Implement in-memory store and default 7-day expiration.
- [x] Add Supabase-backed store behind the same interface.
- [x] Run focused tests.

### Task 2: Share And Lookup APIs With TDD

**Files:**
- Create: `app/api/trips/share/route.ts`
- Create: `app/api/trips/share/route.test.ts`
- Create: `app/api/trips/[tripId]/route.ts`
- Create: `app/api/trips/[tripId]/route.test.ts`

- [x] Write failing tests for valid share creation, invalid body, found lookup, and missing lookup.
- [x] Implement route handler factories with injectable stores.
- [x] Wire default handlers to `createDefaultTripShareStore(process.env)`.
- [x] Run focused tests.

### Task 3: Documentation And Verification

**Files:**
- Create: `docs/contracts/share-trip-results.md`
- Create: `docs/handoffs/share-trip-results.md`
- Modify: `docs/collaboration/work-board.md`
- Modify: `todo.md`

- [x] Document API responses, 7-day expiration, and Supabase table.
- [x] Run full test, lint, typecheck, build, and diff checks.
- [ ] Commit and push the feature branch.
