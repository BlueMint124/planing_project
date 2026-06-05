# Trip Generation API Handoff

## Ownership

- 담당자: 주 개발자
- 브랜치: `codex/trip-generation-api`
- 상태: review
- Pull Request: 생성 예정
- 마지막 갱신: 2026-06-05

## Goal

검증된 요청만 처리하고, 데모 모드에서 제주 mock 일정을 반환하며, 모든 실패를
requestId로 추적할 수 있는 `POST /api/trips/generate` 엔드포인트를 제공한다.

## Completed

- 입력과 출력 Zod 검증을 사용하는 생성 서비스
- 요청별 requestId 생성
- 응답 시간 측정과 구조화 성공 및 실패 로그
- `DEMO_MODE=true` 제주 mock 응답
- 잘못된 입력의 400 `INVALID_REQUEST` 응답
- 비데모 또는 생성 실패의 500 `GENERATION_FAILED` 응답
- Route Handler와 생성 서비스 단위 테스트

## Changed Contracts

- `docs/contracts/trip-generation-api.md`

## Key Files

- `src/features/trips/generation-service.ts`: 생성 흐름, 검증, 로그, 오류 응답
- `app/api/trips/generate/route.ts`: Next.js Route Handler와 데모 생성기 선택
- `app/api/trips/generate/route.test.ts`: HTTP 상태 코드와 응답 테스트

## Verification

| 명령 | 결과 |
| --- | --- |
| `npm run test` | 6개 테스트 파일, 20개 테스트 통과 |
| `npm run lint` | 오류 및 경고 없음 |
| `npm run typecheck` | 통과 |
| `npm run build` | `/api/trips/generate`를 포함한 Next.js 프로덕션 빌드 통과 |

## Remaining Work

- Google Places 및 Routes 기반 장소 후보와 이동 시간 수집
- OpenAI Structured Outputs 기반 실제 일정 생성
- 동일 요청 중복 또는 상태 충돌의 409 처리
- 운영용 로그 수집 및 에러 트래킹 도구 연결

## Known Issues And Risks

- `DEMO_MODE`가 `true`가 아니면 실제 생성기가 아직 없으므로 500 응답을 반환한다.
- 데모 응답은 입력 목적지와 무관하게 제주 mock 일정이다.

## Next Agent Start Prompt

```text
AGENTS.md, docs/collaboration/prompts/main-developer-start.md,
docs/handoffs/trip-generation-api.md, docs/contracts/trip-generation-api.md를 읽고
장소 및 동선 연동 기능을 시작해줘.
```
