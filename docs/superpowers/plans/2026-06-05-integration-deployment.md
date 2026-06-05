# Integration Deployment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans or
> superpowers:subagent-driven-development to implement this plan task-by-task.

**Goal:** Add CI and deployment readiness checks for the MVP demo.

---

### Task 1: Health Check With TDD

**Files:**
- Create: `app/api/health/route.ts`
- Create: `app/api/health/route.test.ts`

- [x] Write failing tests for sanitized status/dependency output.
- [x] Implement `GET /api/health`.
- [x] Run focused tests.

### Task 2: CI Workflow

**Files:**
- Create: `.github/workflows/ci.yml`

- [x] Run `npm ci`.
- [x] Run test, lint, build, and typecheck.
- [x] Run `typecheck` after `build` because Next generates `.next/types`.

### Task 3: Deployment Docs And Verification

**Files:**
- Create: `docs/deployment/vercel-demo.md`
- Create: `docs/handoffs/integration-deployment.md`
- Modify: `docs/collaboration/work-board.md`
- Modify: `todo.md`

- [x] Document demo env vars and health check.
- [x] Run full test, lint, build, typecheck, and diff checks.
- [ ] Commit and push the feature branch.
