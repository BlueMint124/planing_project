# Feature Ownership Plan

이 문서는 두 명의 개발자가 기능 단위로 작업을 나누기 위한 기준이다.

협업자는 무료 Codex를 사용하므로, 읽어야 하는 맥락이 작고 공통 계약 변경이 적은
UI 기능을 담당한다. 주 개발자는 외부 API, AI, 데이터베이스, 공통 계약과 통합처럼
맥락과 위험이 큰 기능을 담당한다.

## Ownership Principles

- 한 기능은 한 작업자가 끝까지 소유한다.
- 협업자 기능은 mock 데이터와 고정된 계약으로 독립 실행 가능해야 한다.
- 협업자는 `docs/contracts/`의 계약을 소비하지만 임의로 변경하지 않는다.
- 계약 변경이 필요하면 구현을 멈추고 작업 보드에 `blocked`로 기록한다.
- 공통 설정 파일과 공통 타입은 주 개발자가 소유한다.
- 기능별 브랜치와 Pull Request를 사용한다.

## Main Developer

주 개발자는 프로젝트 기반과 백엔드 중심 기능을 담당한다.

| 순서 | 기능 | 브랜치 | 주요 결과 |
| --- | --- | --- | --- |
| 1 | 프로젝트 골격과 공통 계약 | `codex/project-foundation` | Next.js, 테스트 도구, 공통 타입, mock 데이터 |
| 2 | 여행 생성 API | `codex/trip-generation-api` | 입력 검증, 상태, 오류 계약, 데모 응답 |
| 3 | 장소 및 동선 연동 | `codex/place-route-adapters` | Google Places 및 Routes 어댑터 |
| 4 | AI 일정 생성 | `codex/ai-itinerary-generation` | OpenAI Structured Outputs, 비용 계산 |
| 5 | 공유 결과 저장 및 조회 | `codex/share-trip-results` | Supabase 저장, 공유 URL, 만료 처리 |
| 6 | 통합, 관찰 가능성, 배포 | `codex/integration-deployment` | 로그, 환경 변수, Vercel 배포, 최종 QA |

## Collaborator With Limited Tokens

협업자는 계약이 고정된 프론트엔드 기능을 작게 나누어 담당한다.

| 순서 | 기능 | 브랜치 | 주요 결과 |
| --- | --- | --- | --- |
| 1 | 여행 조건 입력 UI | `codex/trip-input-ui` | 단계형 폼, 지역, 기간, 예산, 인원 |
| 2 | 여행 스타일 및 멤버 선호 UI | `codex/travel-preferences-ui` | 스타일 태그, 멤버 선호 카드 |
| 3 | 입력 검증 표시 UI | `codex/form-validation-ui` | 필드 인라인 오류, 생성 버튼 상태 |
| 4 | 생성 로딩 및 실패 UI | `codex/generation-status-ui` | 로딩 화면, 실패 토스트, 재시도 버튼 |
| 5 | 여행 결과 카드 UI | `codex/trip-result-cards` | 비용 요약, 일자별 일정, 예약 링크 버튼 |
| 6 | 공유 및 데모 화면 마감 | `codex/share-demo-ui` | 공유 버튼, 빈 상태, 면책 안내, 반응형 마감 |

## Dependency Order

```text
project-foundation
├─ trip-input-ui
├─ travel-preferences-ui
├─ form-validation-ui
├─ generation-status-ui
├─ trip-result-cards
└─ share-demo-ui

project-foundation
└─ trip-generation-api
   ├─ place-route-adapters
   ├─ ai-itinerary-generation
   └─ share-trip-results

all features
└─ integration-deployment
```

## Required Foundation Before Parallel Work

협업자가 UI 개발을 시작하기 전에 주 개발자는 다음을 `main`에 병합해야 한다.

- Next.js App Router 프로젝트 골격
- Tailwind CSS와 shadcn/ui 기본 설정
- Vitest와 React Testing Library 설정
- 공통 요청 및 응답 타입
- Zod 스키마
- 고정 제주 mock 요청과 mock 결과
- UI가 호출할 API 클라이언트 인터페이스
- 공통 실행 명령과 환경 변수 예시

첫 작업은 `docs/collaboration/prompts/main-project-foundation.md` 프롬프트를 사용한다.
협업자의 첫 작업은 foundation 병합 후
`docs/collaboration/prompts/collaborator-trip-input-ui.md` 프롬프트를 사용한다.

## Token-Saving Rules For Collaborator

- 작업 시작 시 자신의 기능과 직접 관련된 문서 및 파일만 읽는다.
- 외부 API 문서, AI 프롬프트, 데이터베이스 구현은 읽지 않는다.
- mock 데이터로 UI를 개발하고 실제 API 연동은 주 개발자에게 맡긴다.
- 한 브랜치에서 하나의 화면 기능만 구현한다.
- 공통 타입이 부족하면 새 타입을 만들지 말고 작업 보드에 차단 사유를 기록한다.
- 긴 설명 대신 handoff 문서에 변경 파일, 검증 결과, 남은 작업만 간결하게 기록한다.

## Integration Ownership

- 협업자 PR은 주 개발자가 리뷰한다.
- 주 개발자는 계약 일치 여부와 통합 테스트를 확인한 뒤 병합한다.
- 협업자는 백엔드 코드와 외부 API 어댑터를 수정하지 않는다.
- 주 개발자는 협업자 UI 내부 구조를 불필요하게 변경하지 않는다.
