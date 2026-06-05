# AI Itinerary Generation Handoff

## Ownership

- Owner: main developer
- Branch: `codex/ai-itinerary-generation`
- Status: review
- Pull Request: planned
- Last updated: 2026-06-05

## Goal

Create the AI itinerary generation boundary that turns validated trip requests,
normalized place candidates, and route timings into the shared
`TripGenerationResponse` contract.

## Completed

- Added deterministic prompt builder with member-name minimization.
- Added OpenAI Responses API generator using Structured Outputs through
  `zodTextFormat`.
- Added OpenAI-only nullable `bookingUrl` schema and normalization back to the
  public optional `bookingUrl` contract.
- Added cost summary recalculation so model-provided totals are not trusted.
- Added provider-neutral orchestration that:
  - searches place candidates,
  - computes adjacent route hints,
  - delegates to the AI generator.
- Added TDD coverage for prompt content, cost summary, OpenAI call shape,
  invalid AI output, provider orchestration, and insufficient place candidates.

## Changed Contracts

- Added `docs/contracts/ai-itinerary-generator.md`.
- Public `TripGenerationResponse` contract is unchanged.

## Key Files

- `src/features/ai/cost-summary.ts`
- `src/features/ai/itinerary-prompt.ts`
- `src/features/ai/openai-itinerary-generator.ts`
- `src/features/ai/trip-itinerary-generator.ts`
- `src/features/ai/*.test.ts`

## Verification

| Command | Result |
| --- | --- |
| `npm test -- src\features\ai` | 4 test files, 7 tests passed |
| `npm run test` | 13 test files, 34 tests passed |
| `npm run lint` | Passed |
| `npm run typecheck` | Passed |
| `npm run build` | Next.js production build passed |
| `git diff --check` | Passed with LF/CRLF warnings only |

## Remaining Work

- Wire the generator into `app/api/trips/generate/route.ts` for non-demo mode.
- Add environment variable handling for `OPENAI_API_KEY` and Google API keys in
  the route composition layer.
- Decide whether to compute all-pair route hints or keep adjacent-candidate hints
  for MVP cost control.
- Add live smoke testing with real API keys outside unit tests.
- Add duplicate request or generation-state conflict handling for 409 responses.

## Known Risks

- The OpenAI call is unit-tested with an injected fake client, not a live API key.
- Prompt wording is deterministic but has not yet been tuned against live model
  outputs.
- Route hints currently follow provider candidate order. A later optimization
  pass can rank candidates before route hint generation.

## Next Agent Start Prompt

```text
AGENTS.md, docs/collaboration/prompts/main-developer-start.md,
docs/handoffs/ai-itinerary-generation.md,
docs/contracts/ai-itinerary-generator.md,
docs/contracts/trip-generation-api.md를 읽고
AI 일정 생성기를 /api/trips/generate 비데모 경로에 연결해줘.
DEMO_MODE=true 동작은 유지하고, 실제 API 키가 없을 때는 안전한
GENERATION_FAILED 응답이 나오도록 해줘.
```
