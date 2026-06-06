# Demo MVP UI Handoff

## Summary

`codex/demo-mvp-ui` 브랜치에서 발표 시연용 데스크톱 MVP 흐름을 구현했다.
사용자는 홈 화면에서 여행 조건을 입력하고 일정을 생성한 뒤, 결과를 공유 URL로 만들고
`/share/[tripId]`에서 다시 열 수 있다.

## Implemented

- `src/features/trips/api-client.ts`
  - `createHttpTripApiClient` 추가
  - `generateTrip`, `shareTrip`, `getSharedTrip`를 API Route 계약에 맞게 호출
  - 공유 응답과 공유 조회 응답 Zod 스키마 추가
- `src/features/demo/DemoPlanner.tsx`
  - 데모 기본값 기반 입력 폼
  - 생성 로딩, 성공, 실패 상태
  - 결과 공유 버튼과 공유 URL 표시
- `src/features/demo/TripResultView.tsx`
  - 비용 요약
  - 일자별 일정 카드
  - 외부 상세 링크
  - 좌표 기반 동선 요약 패널
- `src/features/demo/SharedTripPage.tsx`
  - 공유 결과 조회
  - 로딩, 성공, 누락/만료 상태
- `app/page.tsx`, `app/share/[tripId]/page.tsx`
  - App Router 진입점 연결

## 2026-06-06 One-Day Polish

- 여행 기간을 발표용 고정 표시에서 실제 선택 컨트롤로 확장했다.
- 여행 스타일을 전체 옵션 토글로 확장했다.
- 멤버 이름, 선호, 비선호를 직접 편집하고 멤버를 추가/삭제할 수 있게 했다.
- 생성 실패 후 `다시 시도`, 결과 생성 후 `현재 조건으로 재생성` 동작을 추가했다.
- Playwright smoke는 `localhost` 기준으로 실행한다. `127.0.0.1`에서는 Next dev hydration이
  붙지 않는 현상이 있어 사용하지 않는다.

## 2026-06-06 Presentation Step Flow

- `codex/presentation-polish-ui` 브랜치에서 레퍼런스 디자인 기준의 4단계 플로우를 추가했다.
- 1단계는 기본 정보, 2단계는 여행 스타일과 멤버 선호, 3단계는 AI 생성 진행 또는 실패, 4단계는 결과 확인과 공유로 분리했다.
- 기존처럼 1단계에서 바로 결과 화면으로 넘어가지 않고, 버튼과 상단 스텝 네비게이션이 현재 단계를 반영한다.
- 데스크톱 발표 화면을 우선하되 1024px 이하에서는 입력과 요약 패널이 세로로 내려가도록 보강했다.

## 2026-06-06 Travel Cost Coverage

- 발표용 제주 데모 일정에 왕복 항공권, 제주 현지 교통비, 점심/저녁 식사 일정을 명시적으로 추가했다.
- 결과 화면에는 `비용 반영 항목` 블록을 추가해 항공, 교통, 식사, 관광/체험 비용이 1인당 총액에 포함됐음을 보여준다.
- 항공권은 실시간 최저가 API가 아니라 발표 안정성을 위한 1인당 추정 비용이다.
- live AI 프롬프트에도 식사 일정, 현지 교통비, 항공 또는 장거리 이동 비용을 포함하도록 규칙을 추가했다.

## Verification

통과:

- `npm.cmd test -- src\features\trips\api-client.test.ts`
- `npm.cmd test -- src\features\demo\DemoPlanner.test.tsx src\features\demo\SharedTripPage.test.tsx`
- `npm.cmd run test`
- `npm.cmd run typecheck`
- `npm.cmd run lint`
- `npm.cmd run build`
- `git diff --check`
- Chrome Playwright smoke: `/` 생성 -> 공유 URL 생성 -> `/share/trip_demo_jeju_001` 조회
- `npm.cmd run test:e2e -- tests/e2e/demo-polish.spec.ts`
- `npm.cmd test -- src\features\trips\fallback-trip-generator.test.ts app\api\trips\generate\route.test.ts`
- 4단계 플로우 검증:
  - `npm.cmd test -- src\features\demo\DemoPlanner.test.tsx src\features\demo\SharedTripPage.test.tsx`
  - `npm.cmd run test`
  - `npm.cmd run typecheck`
  - `npm.cmd run lint`
  - `npm.cmd run build`
  - `npm.cmd run test:e2e -- tests/e2e/demo-polish.spec.ts`
  - 앱 내 브라우저에서 `STEP 1 / 4` -> `STEP 2 / 4` -> 생성 -> `STEP 4 / 4` 결과 표시 확인
- 항공/교통/식사 비용 반영 검증:
  - `npm.cmd test -- src\features\trips\mock-trip.test.ts src\features\ai\itinerary-prompt.test.ts src\features\ai\openai-itinerary-generator.test.ts`
  - `npm.cmd test -- src\features\demo\DemoPlanner.test.tsx`
  - `npm.cmd run test`
  - `npm.cmd run lint`
  - `npm.cmd run build`
  - `npm.cmd run test:e2e -- tests/e2e/demo-polish.spec.ts`

## 2026-06-06 Live API First Fallback

- `POST /api/trips/generate`는 `DEMO_MODE`가 `true`가 아닐 때 live OpenAI/Google generator를 먼저 시도한다.
- live key가 없거나 provider 실패 또는 `LIVE_GENERATION_TIMEOUT_MS` 초과가 발생하면 발표 흐름을 깨지 않도록 검증된 제주 demo 일정으로 fallback한다.
- fallback 사용 시 `trip_generation_fallback_used` 이벤트와 원래 실패 이유를 서버 로그에 남긴다.
- Vercel에 실제 환경 변수를 넣으면 같은 API 라우트에서 실 provider를 사용할 수 있고, 키가 빠진 환경에서도 데모 UI는 유지된다.

## Remaining Work

- 실제 지도 SDK 시각화
- Vercel 배포 URL에서 smoke 확인
