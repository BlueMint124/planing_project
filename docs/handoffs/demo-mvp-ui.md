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

## Remaining Work

- 여행 기간 preset 전체 선택 UI
- 여행 스타일 전체 다중 선택 UI
- 멤버별 선호/비선호 직접 입력 UI
- 실제 지도 SDK 시각화
- Playwright 기반 발표 시연 E2E
