# Place Route Adapters Handoff

## Ownership

- 담당자: 주 개발자
- 브랜치: `codex/place-route-adapters`
- 상태: review
- Pull Request: 생성 예정
- 마지막 갱신: 2026-06-05

## Goal

AI 일정 생성이 Google API 응답 형태에 직접 의존하지 않도록 장소 후보와 이동 시간
계산을 provider-neutral 어댑터로 제공한다.

## Completed

- 장소 후보 정규화 타입과 `PlaceProvider` 인터페이스
- 여행 스타일 기반 Text Search 쿼리 생성
- 인접 지역 fallback 쿼리 생성 helper
- Google Places Text Search(New) 어댑터
- 이동 거리와 소요 시간 정규화 타입과 `RouteProvider` 인터페이스
- Google Routes computeRoutes 어댑터
- field mask, 요청 형태, 실패 흐름 테스트

## Changed Contracts

- `docs/contracts/place-provider-adapter.md`

## Key Files

- `src/features/places/place-provider.ts`
- `src/features/places/google-places-provider.ts`
- `src/features/routes/route-provider.ts`
- `src/features/routes/google-routes-provider.ts`

## Verification

| 명령 | 결과 |
| --- | --- |
| `npm run test` | 9개 테스트 파일, 27개 테스트 통과 |
| `npm run lint` | 오류 및 경고 없음 |
| `npm run typecheck` | 통과 |
| `npm run build` | Next.js 프로덕션 빌드 통과 |

## Remaining Work

- 여행 생성 서비스에서 장소 후보와 이동 시간 어댑터를 실제로 조합
- 장소 후보 부족 시 인접 지역 fallback을 자동 실행
- 실제 Google API 키를 사용한 수동 smoke test
- AI 생성 프롬프트에 장소 후보와 이동 시간 전달

## Known Issues And Risks

- 실제 API 호출은 테스트하지 않았다. 테스트는 fetch를 주입한 계약 테스트다.
- Google API field mask 변경은 과금과 응답 형태에 영향을 줄 수 있으므로 PR에서
  명시해야 한다.

## Next Agent Start Prompt

```text
AGENTS.md, docs/collaboration/prompts/main-developer-start.md,
docs/handoffs/place-route-adapters.md, docs/contracts/place-provider-adapter.md를 읽고
AI 일정 생성 기능을 시작해줘.
```
