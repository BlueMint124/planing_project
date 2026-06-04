# Project Foundation Handoff

## Ownership

- 담당자: 주 개발자
- 브랜치: `codex/project-foundation`
- 상태: review
- Pull Request: 생성 예정
- 마지막 갱신: 2026-06-04

## Goal

협업자가 외부 API 없이 공통 타입, 제주 mock 데이터, 디자인 토큰을 사용해 UI 개발을
시작할 수 있는 Next.js 프로젝트 골격을 제공한다.

## Completed

- Next.js App Router + TypeScript 애플리케이션 셸
- Tailwind CSS, shadcn/ui 설정, `DESIGN.md` 색상 토큰
- React Hook Form 기본값과 Zod resolver
- Vitest, React Testing Library, Playwright, ESLint, Prettier 설정
- 여행 생성 요청, 응답, 오류, 상태 공통 타입과 Zod 스키마
- 제주 mock 요청과 결과
- UI용 `TripApiClient` 인터페이스와 mock 클라이언트
- 환경 변수 예시와 개발 시작 문서
- API 및 상태 계약 문서

## Changed Contracts

- `docs/contracts/trip-generation-api.md`
- `docs/contracts/trip-state-model.md`

## Key Files

- `src/features/trips/contracts.ts`: 공통 타입과 Zod 스키마
- `src/features/trips/mock-trip.ts`: 제주 mock 요청과 결과
- `src/features/trips/api-client.ts`: UI가 사용할 API 클라이언트 인터페이스
- `src/features/trips/trip-form.ts`: 폼 기본값과 Zod resolver
- `app/globals.css`: 디자인 토큰과 전역 스타일
- `README.md`: 실행 및 검증 명령

## Verification

| 명령 | 결과 |
| --- | --- |
| `npm run test` | 4개 테스트 파일, 14개 테스트 통과 |
| `npm run lint` | 오류 및 경고 없음 |
| `npm run typecheck` | 통과 |
| `npm run build` | Next.js 프로덕션 빌드 통과 |

## Remaining Work

- `POST /api/trips/generate` Route Handler 구현
- `DEMO_MODE=true`에서 mock 결과를 반환하는 서버 흐름 구현
- 협업자의 여행 조건 입력 UI 구현

## Known Issues And Risks

- `npm audit --omit=dev`가 Next.js의 `postcss <8.5.10` 의존성에서 중간 심각도
  취약점 2건을 보고했다. npm의 자동 수정은 Next.js 9.3.3으로 breaking downgrade를
  제안하므로 적용하지 않았다.
- 실제 OpenAI, Google Maps, Supabase 연동은 아직 구현하지 않았다.

## Next Agent Start Prompt

```text
AGENTS.md, docs/collaboration/prompts/collaborator-trip-input-ui.md,
docs/handoffs/project-foundation.md, DESIGN.md, docs/ui-design/screens.md를 읽고
여행 조건 입력 UI 개발을 시작해줘.
```
