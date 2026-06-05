# Live Trip Generation Wiring Handoff

## Ownership

- Owner: main developer
- Branch: `codex/live-trip-generation-wiring`
- Status: review
- Pull Request: planned
- Last updated: 2026-06-05

## Goal

Wire the provider-neutral AI itinerary generator into
`POST /api/trips/generate` for non-demo mode while preserving safe demo behavior.

## Completed

- Added `createLiveTripGenerator` composition layer.
- Wired non-demo route generation to:
  - Google Places provider,
  - Google Routes provider,
  - OpenAI Responses API generator,
  - trip generation service error handling.
- Preserved `DEMO_MODE=true` fixed mock itinerary behavior.
- Added `OPENAI_MODEL=gpt-5.4-mini` to `.env.example`.
- Updated trip generation and AI itinerary contracts.
- Added tests for missing live keys and live provider/OpenAI composition.

## Changed Contracts

- `docs/contracts/trip-generation-api.md`
- `docs/contracts/ai-itinerary-generator.md`

## Key Files

- `app/api/trips/generate/route.ts`
- `src/features/trips/live-trip-generator.ts`
- `src/features/trips/live-trip-generator.test.ts`
- `.env.example`

## Verification

| Command | Result |
| --- | --- |
| `npm test -- app\api\trips\generate\route.test.ts src\features\trips\live-trip-generator.test.ts` | 2 test files, 5 tests passed |
| `npm run test` | 14 test files, 36 tests passed |
| `npm run lint` | Passed |
| `npm run typecheck` | Passed |
| `npm run build` | Next.js production build passed |
| `git diff --check` | Passed with LF/CRLF warnings only |

## Remaining Work

- Run a live smoke test with real `OPENAI_API_KEY` and `GOOGLE_MAPS_API_KEY`.
- Decide whether live route hints should remain adjacent-only or move to ranked
  candidates/all-pair hints.
- Add 409 duplicate request or in-flight generation conflict handling.
- Create Pull Requests in branch-stack order before merging to `main`.

## Known Risks

- Unit tests use fake Google/OpenAI responses; no real external API call has been
  made in this branch.
- Missing or invalid live keys intentionally surface to the user as safe
  `GENERATION_FAILED` responses through the existing service layer.

## Next Agent Start Prompt

```text
AGENTS.md, docs/collaboration/prompts/main-developer-start.md,
docs/handoffs/live-trip-generation-wiring.md,
docs/contracts/trip-generation-api.md를 읽고
공유 결과 저장 및 조회 기능을 시작해줘.
비데모 생성 경로는 이미 live generator를 조립하므로 DEMO_MODE 동작을 깨지 않게 유지해줘.
```
