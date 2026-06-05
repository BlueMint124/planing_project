# Collaboration Work Board

현재 진행 중인 작업의 소유권, 브랜치, 의존성, handoff 위치를 빠르게 확인하기 위한
공유 작업 보드다. 자세한 구현 맥락은 `docs/handoffs/`와 Pull Request에 기록한다.

## Status

- `planned`: 아직 시작 전
- `in-progress`: 구현 진행 중
- `blocked`: 외부 결정 또는 다른 기능 완료가 필요함
- `review`: 구현과 검증이 끝나 리뷰 또는 병합 대기
- `done`: `main`에 반영 완료

## Active Work

| 기능 | 담당자 | 브랜치 | 상태 | 의존성 | Handoff | PR |
| --- | --- | --- | --- | --- | --- | --- |
| 작업 하네스 | Codex | `codex/collaboration-harness` | done | 없음 | `docs/handoffs/collaboration-harness.md` | main 반영 완료 |
| 프로젝트 골격과 공통 계약 | 주 개발자 | `codex/project-foundation` | done | 작업 하네스 | `docs/handoffs/project-foundation.md` | main 반영 완료 |
| 여행 조건 입력 UI | 제한 토큰 협업자 | `codex/trip-input-ui` | planned | 프로젝트 골격과 공통 계약 | 생성 예정 | 생성 예정 |
| 여행 스타일 및 멤버 선호 UI | 제한 토큰 협업자 | `codex/travel-preferences-ui` | planned | 프로젝트 골격과 공통 계약 | 생성 예정 | 생성 예정 |
| 입력 검증 표시 UI | 제한 토큰 협업자 | `codex/form-validation-ui` | planned | 프로젝트 골격, 여행 조건 입력 UI | 생성 예정 | 생성 예정 |
| 생성 로딩 및 실패 UI | 제한 토큰 협업자 | `codex/generation-status-ui` | planned | 프로젝트 골격과 공통 계약 | 생성 예정 | 생성 예정 |
| 여행 결과 카드 UI | 제한 토큰 협업자 | `codex/trip-result-cards` | planned | 프로젝트 골격과 공통 계약 | 생성 예정 | 생성 예정 |
| 공유 및 데모 화면 마감 | 제한 토큰 협업자 | `codex/share-demo-ui` | planned | 결과 카드 UI, 공유 결과 API | 생성 예정 | 생성 예정 |
| 여행 생성 API | 주 개발자 | `codex/trip-generation-api` | done | 프로젝트 골격과 공통 계약 | `docs/handoffs/trip-generation-api.md` | main 반영 완료 |
| 장소 및 동선 연동 | 주 개발자 | `codex/place-route-adapters` | done | 여행 생성 API | `docs/handoffs/place-route-adapters.md` | main 반영 완료 |
| AI 일정 생성 | 주 개발자 | `codex/ai-itinerary-generation` | done | 여행 생성 API, 장소 및 동선 연동 | `docs/handoffs/ai-itinerary-generation.md` | main 반영 완료 |
| 비데모 생성 경로 연결 | 주 개발자 | `codex/live-trip-generation-wiring` | done | AI 일정 생성 | `docs/handoffs/live-trip-generation-wiring.md` | main 반영 완료 |
| 공유 결과 저장 및 조회 | 주 개발자 | `codex/share-trip-results` | done | 프로젝트 골격과 공통 계약 | `docs/handoffs/share-trip-results.md` | main 반영 완료 |
| 통합, 관찰 가능성, 배포 | 주 개발자 | `codex/integration-deployment` | review | 모든 백엔드 기능 | `docs/handoffs/integration-deployment.md` | 생성 예정 |

## Shared File Lock

공통 파일을 수정하기 전에 행을 추가하고, 작업이 끝나면 상태를 갱신한다. 완료된 작업의
행은 히스토리로 남겨 둔다.

| 파일 또는 경로 | 작업자 | 브랜치 | 이유 | 예상 해제 |
| --- | --- | --- | --- | --- |
| 프로젝트 설정, 공통 계약, `todo.md` | 주 개발자 | `codex/project-foundation` | 프로젝트 골격과 공통 계약 구성 | main 반영 완료 |
| `app/api/trips/generate`, 생성 서비스, API 계약 | 주 개발자 | `codex/trip-generation-api` | 여행 생성 API 구현 | main 반영 완료 |
| 장소 및 동선 어댑터, `todo.md` | 주 개발자 | `codex/place-route-adapters` | Google Places 및 Routes 어댑터 구현 | main 반영 완료 |
| AI 일정 생성기, AI 계약, `todo.md` | 주 개발자 | `codex/ai-itinerary-generation` | OpenAI Structured Outputs 생성기 구현 | main 반영 완료 |
| 비데모 생성 경로, env 예시, API 계약 | 주 개발자 | `codex/live-trip-generation-wiring` | 실제 생성기 조립 및 라우트 연결 | main 반영 완료 |
| 공유 결과 API, 공유 계약, `todo.md` | 주 개발자 | `codex/share-trip-results` | 공유 결과 저장 및 조회 구현 | main 반영 완료 |
| CI, 헬스체크, 배포 문서, `todo.md` | 주 개발자 | `codex/integration-deployment` | 배포 준비와 관찰 가능성 정리 | PR 병합 후 |

## Coordination Notes

- API와 데이터 타입의 기준은 `docs/contracts/`에 기록한다.
- UI 구현 기준은 `DESIGN.md`와 `docs/ui-design/screens.md`에 기록한다.
- 작업 보드는 요약만 유지한다. 긴 설명은 handoff 문서에 작성한다.
- 완료된 작업은 행을 삭제하지 않고 상태를 `done`으로 바꿔 이력을 보존한다.
# 2026-06-06 Active Addition

| 기능 | 담당자 | 브랜치 | 상태 | 의존성 | Handoff | PR |
| --- | --- | --- | --- | --- | --- | --- |
| 발표용 데모 MVP UI | 주 개발자 | `codex/demo-mvp-ui` | in-progress | 생성/공유 API | `docs/handoffs/demo-mvp-ui.md` | 생성 예정 |

## 2026-06-06 Shared File Lock Addition

| 파일 또는 경로 | 작업자 | 브랜치 | 이유 | 예상 해제 |
| --- | --- | --- | --- | --- |
| 데모 MVP UI, `todo.md`, `README.md` | 주 개발자 | `codex/demo-mvp-ui` | 발표 시연용 입력-생성-결과-공유 흐름 구현 | PR 병합 후 |
