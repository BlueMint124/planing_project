# Live Trip Generation Wiring Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans or
> superpowers:subagent-driven-development to implement this plan task-by-task.

**Goal:** Connect non-demo `POST /api/trips/generate` requests to the live
OpenAI/Google itinerary generation pipeline while preserving demo safety.

**Architecture:** Keep route handling thin. Move live dependency composition into
`src/features/trips/live-trip-generator.ts` so route tests and composition tests
can remain deterministic without external API calls.

---

### Task 1: Live Generator Factory With TDD

**Files:**
- Create: `src/features/trips/live-trip-generator.ts`
- Create: `src/features/trips/live-trip-generator.test.ts`

- [x] Write failing tests for missing live keys and configured provider/OpenAI composition.
- [x] Implement env validation and provider/client composition.
- [x] Run focused tests.

### Task 2: Route Wiring

**Files:**
- Modify: `app/api/trips/generate/route.ts`

- [x] Preserve `DEMO_MODE=true` mock response.
- [x] Use `createLiveTripGenerator({ env: process.env })` for non-demo mode.
- [x] Verify route and live generator focused tests.

### Task 3: Documentation And Verification

**Files:**
- Modify: `.env.example`
- Modify: `docs/contracts/trip-generation-api.md`
- Modify: `docs/contracts/ai-itinerary-generator.md`
- Modify: `docs/collaboration/work-board.md`
- Modify: `todo.md`
- Create: `docs/handoffs/live-trip-generation-wiring.md`

- [x] Document env vars, behavior, and remaining live smoke risk.
- [x] Run full test, lint, typecheck, build, and diff checks.
- [ ] Commit and push the feature branch.
