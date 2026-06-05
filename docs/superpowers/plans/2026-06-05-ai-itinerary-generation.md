# AI Itinerary Generation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an OpenAI Structured Outputs itinerary generator that converts validated trip requests, place candidates, and route timings into the shared trip response contract.

**Architecture:** Keep prompt construction deterministic and separately tested. Implement an AI generator interface that uses an injected OpenAI-compatible client and validates parsed output with the existing trip response schema, so the route handler can later swap from demo mock generation to live generation without changing the HTTP contract.

**Tech Stack:** TypeScript, Zod, OpenAI Responses API, Structured Outputs, Vitest

---

### Task 1: Prompt Builder With TDD

**Files:**
- Create: `src/features/ai/itinerary-prompt.ts`
- Create: `src/features/ai/itinerary-prompt.test.ts`

- [x] Write failing tests for deterministic prompt content and private-member-data minimization.
- [x] Implement prompt builder using request summary, place candidates, and route timings.
- [x] Run focused tests.

### Task 2: OpenAI Itinerary Generator With TDD

**Files:**
- Create: `src/features/ai/openai-itinerary-generator.ts`
- Create: `src/features/ai/openai-itinerary-generator.test.ts`

- [x] Write failing tests for Responses API call shape, parsed output validation, and invalid AI output.
- [x] Implement generator with injected client, `gpt-5.4-mini`, and structured output format.
- [x] Run focused tests.

### Task 2.5: Provider Orchestration With TDD

**Files:**
- Create: `src/features/ai/trip-itinerary-generator.ts`
- Create: `src/features/ai/trip-itinerary-generator.test.ts`

- [x] Write failing tests for place collection, route hint generation, and insufficient candidates.
- [x] Implement provider-neutral orchestration around `PlaceProvider`, `RouteProvider`, and AI generator.
- [x] Run focused tests.

### Task 3: Contracts And Handoff Documentation

**Files:**
- Create: `docs/contracts/ai-itinerary-generator.md`
- Create: `docs/handoffs/ai-itinerary-generation.md`
- Modify: `docs/collaboration/work-board.md`
- Modify: `todo.md`

- [x] Document model, prompt inputs, structured output requirements, and failure behavior.
- [x] Run full test, lint, typecheck, and build verification.
- [ ] Commit and push the feature branch.
