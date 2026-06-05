# 여행메이트

동선, 예산, 단체 취향을 고려해 여행 일정을 생성하는 데스크톱 중심 웹 애플리케이션이다.

## Tech Stack

- Next.js App Router + TypeScript
- Tailwind CSS + shadcn/ui
- React Hook Form + Zod
- Vitest + React Testing Library + Playwright
- Vercel, Supabase, OpenAI, Google Maps Platform

## Getting Started

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

브라우저에서 `http://localhost:3000`을 연다.

## Commands

| 명령 | 용도 |
| --- | --- |
| `npm run dev` | 로컬 개발 서버 실행 |
| `npm run test` | 단위 및 컴포넌트 테스트 실행 |
| `npm run test:watch` | 테스트 감시 모드 |
| `npm run test:e2e` | Playwright 사용자 흐름 테스트 |
| `npm run lint` | ESLint 검사 |
| `npm run typecheck` | TypeScript 타입 검사 |
| `npm run build` | 프로덕션 빌드 |

## Shared UI Development

협업자는 외부 API 없이 다음 파일을 사용해 UI를 개발할 수 있다.

- `src/features/trips/contracts.ts`: 공통 타입과 Zod 스키마
- `src/features/trips/mock-trip.ts`: 제주 mock 요청과 결과
- `src/features/trips/api-client.ts`: UI가 사용하는 API 클라이언트 인터페이스
- `src/features/trips/trip-form.ts`: React Hook Form 기본값과 Zod resolver
- `DESIGN.md`: 디자인 시스템
- `docs/ui-design/screens.md`: 화면별 UI 명세

## Demo Mode

`.env.local`에서 `DEMO_MODE=true`를 사용하면 외부 API 대신 제주 mock 결과를 반환하는
흐름을 구현할 수 있다. 실제 Route Handler는 후속 `trip-generation-api` 기능에서
추가한다.

## Deployment Readiness

- CI workflow: `.github/workflows/ci.yml`
- Demo deployment checklist: `docs/deployment/vercel-demo.md`
- Health check: `GET /api/health`

CI runs tests, lint, production build, and typecheck on pull requests and pushes
to `main`.

## Collaboration

- `AGENTS.md`
- `docs/collaboration/README.md`
- `docs/collaboration/work-board.md`
- `docs/collaboration/feature-ownership.md`
# Demo MVP Flow

현재 데모 UI는 데스크톱 발표 시연을 기준으로 다음 흐름을 제공한다.

- `/`: 여행 지역, 1인당 예산, 인원을 입력하고 `POST /api/trips/generate`로 일정 생성
- 생성 결과: 비용 요약, 일자별 장소 카드, 외부 상세 링크, 좌표 기반 동선 요약 표시
- 공유: `POST /api/trips/share`로 공유 URL 생성
- `/share/[tripId]`: `GET /api/trips/[tripId]`로 공유된 결과 조회

지도는 발표 MVP에서 SDK 연동 전 단계로 좌표와 방문 순서를 보여주는 패널로 구현했다.
이후 Google Maps 시각화로 교체할 수 있도록 결과 컴포넌트를 분리했다.
