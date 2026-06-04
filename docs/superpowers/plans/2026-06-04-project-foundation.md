# Project Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Next.js project foundation, shared trip contracts, validated mock data, and development commands required for parallel UI development.

**Architecture:** Use one Next.js App Router TypeScript application deployed to Vercel. Keep shared trip contracts in focused `src/features/trips` modules, validate all runtime data with Zod, and expose a small API client interface so UI work can use mock data without depending on external services.

**Tech Stack:** Next.js, TypeScript, Tailwind CSS, React Hook Form, Zod, Vitest, React Testing Library, Playwright, ESLint, Prettier, npm

---

### Task 1: Tooling And Application Shell

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `postcss.config.mjs`
- Create: `eslint.config.mjs`
- Create: `.prettierrc.json`
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Create: `playwright.config.ts`
- Create: `app/layout.tsx`
- Create: `app/page.tsx`
- Create: `app/globals.css`

- [x] Install the required packages.
- [x] Add the application shell and design tokens from `DESIGN.md`.
- [x] Add `dev`, `test`, `lint`, `typecheck`, and `build` scripts.
- [x] Run lint, typecheck, and build to verify the shell.

### Task 2: Shared Trip Contracts With TDD

**Files:**
- Create: `src/features/trips/contracts.ts`
- Create: `src/features/trips/contracts.test.ts`
- Create: `docs/contracts/trip-generation-api.md`
- Create: `docs/contracts/trip-state-model.md`

- [x] Write failing tests for valid requests, invalid requests, success responses, and state values.
- [x] Run the contract tests and confirm they fail because the schemas are missing.
- [x] Implement TypeScript types and Zod schemas.
- [x] Run the contract tests and confirm they pass.
- [x] Document the API and state contracts.

### Task 3: Mock Data And API Client With TDD

**Files:**
- Create: `src/features/trips/mock-trip.ts`
- Create: `src/features/trips/mock-trip.test.ts`
- Create: `src/features/trips/api-client.ts`
- Create: `src/features/trips/api-client.test.ts`

- [x] Write failing tests that require the 제주 mock request and response to satisfy the shared schemas.
- [x] Write a failing test for a mock API client that returns the validated response.
- [x] Implement the mock data and API client interface.
- [x] Run the focused tests and confirm they pass.

### Task 4: Environment And Developer Documentation

**Files:**
- Create: `.env.example`
- Create: `README.md`
- Create: `docs/handoffs/project-foundation.md`
- Modify: `docs/collaboration/work-board.md`
- Modify: `todo.md`

- [x] Document environment variables and local commands.
- [x] Record the foundation ownership, verification results, and remaining work.
- [x] Mark the work board and backlog with the current status.
- [x] Run full test, lint, typecheck, and build verification.
- [x] Commit and push the feature branch.
