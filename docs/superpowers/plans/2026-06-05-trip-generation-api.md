# Trip Generation API Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a validated `POST /api/trips/generate` endpoint that returns the 제주 demo itinerary in demo mode and safe traceable errors otherwise.

**Architecture:** Keep the Next.js Route Handler thin and delegate request parsing, generation, timing, request ID creation, and logging to a testable service function. The service accepts dependencies so later OpenAI and place-provider implementations can replace the demo generator without changing the HTTP contract.

**Tech Stack:** Next.js Route Handlers, TypeScript, Zod, Vitest

---

### Task 1: Generation Service With TDD

**Files:**
- Create: `src/features/trips/generation-service.ts`
- Create: `src/features/trips/generation-service.test.ts`

- [x] Write failing tests for demo success, invalid input, and generator failure.
- [x] Run the tests and confirm they fail because the service is missing.
- [x] Implement the generation service with request IDs, timing, validated output, and structured logs.
- [x] Run the focused tests and confirm they pass.

### Task 2: Route Handler With TDD

**Files:**
- Create: `app/api/trips/generate/route.ts`
- Create: `app/api/trips/generate/route.test.ts`

- [x] Write failing tests for 200 demo response, 400 invalid input, and 500 non-demo response.
- [x] Run the tests and confirm they fail because the route is missing.
- [x] Implement the thin Route Handler and environment-based generator selection.
- [x] Run the focused tests and confirm they pass.

### Task 3: Contract And Handoff Documentation

**Files:**
- Modify: `docs/contracts/trip-generation-api.md`
- Create: `docs/handoffs/trip-generation-api.md`
- Modify: `docs/collaboration/work-board.md`
- Modify: `todo.md`

- [x] Document status codes, demo behavior, error codes, and logging fields.
- [x] Record verification results and remaining integration work.
- [x] Run full test, lint, typecheck, and build verification.
- [x] Commit and push the feature branch.
