# Technology Stack Decision

## Decision

AI 단체 여행 일정 생성기 MVP는 Vercel에 배포하는 Next.js 단일 저장소 풀스택
애플리케이션으로 개발한다.

| 영역 | 기술 |
| --- | --- |
| 웹 프레임워크 | Next.js App Router |
| 언어 | TypeScript |
| 배포 | Vercel Hobby |
| 스타일 | Tailwind CSS |
| UI 컴포넌트 | shadcn/ui |
| 폼 상태 | React Hook Form |
| 런타임 스키마 검증 | Zod |
| 서버 API | Next.js Route Handlers |
| 데이터 저장 | Supabase PostgreSQL |
| AI 일정 생성 | OpenAI Responses API + `gpt-5.4-mini` + Structured Outputs |
| 장소 및 동선 | Google Places API (New) + Google Routes API |
| 단위 및 컴포넌트 테스트 | Vitest + React Testing Library |
| 사용자 흐름 테스트 | Playwright |
| 코드 품질 | ESLint + Prettier |
| 패키지 관리 | npm |

## Why This Stack

- Next.js와 Vercel을 사용하면 프론트엔드와 서버 API를 한 저장소에서 배포할 수 있다.
- 하나의 TypeScript 코드베이스에서 프론트엔드와 백엔드가 공통 계약을 공유할 수 있다.
- Supabase는 로그인 없는 공유 결과 임시 저장에 필요한 PostgreSQL을 제공한다.
- OpenAI Structured Outputs와 Zod 검증을 함께 사용해 AI 결과를 신뢰 경계에서
  검증할 수 있다.
- `gpt-5.4-mini`는 Responses API와 Structured Outputs를 지원하며, 발표용 MVP에서
  품질과 비용의 균형이 좋다.
- Google Places와 Routes API를 사용해 장소 검색, 좌표, 이동 시간과 동선을 같은
  제공자에서 처리한다.

## MVP Scope

- 로그인과 사용자 계정은 구현하지 않는다.
- 공유 결과는 추측하기 어려운 `tripId`로 조회한다.
- 앱 내 결제와 실예약 확정은 구현하지 않는다.
- 외부 예약 링크는 장소 상세 페이지 링크 수준으로 제공한다.
- Google Maps와 OpenAI API는 발표 시연 수준의 낮은 호출량만 사용한다.

## Demo Mode

발표 당일 외부 API 장애와 예상치 못한 과금을 피하기 위해 데모 모드를 제공한다.

- 환경 변수 `DEMO_MODE=true`일 때 외부 API를 호출하지 않고 고정된 제주 일정 결과를
  반환한다.
- 실제 AI 생성 흐름과 데모 결과는 동일한 응답 계약을 사용한다.
- 실제 시연은 가능하면 1회만 실행하고, 반복 시연과 실패 복구는 데모 모드를 사용한다.
- Google Cloud에서 API 키 제한, 일일 요청 할당량, 예산 알림을 설정한다.
- OpenAI 프로젝트에서도 낮은 사용 한도를 설정한다.
- OpenAI API는 무료 티어가 지원되지 않으므로 실제 생성 호출은 최소화한다.
- 외부 API 키는 서버 환경 변수에서만 사용하고 브라우저 번들에 포함하지 않는다.

## Planned Environment Variables

| 변수 | 공개 여부 | 용도 |
| --- | --- | --- |
| `DEMO_MODE` | 서버 전용 | 고정 데모 일정 사용 여부 |
| `OPENAI_API_KEY` | 서버 전용 | OpenAI 일정 생성 호출 |
| `GOOGLE_MAPS_API_KEY` | 서버 전용 | Places 및 Routes API 호출 |
| `NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY` | 브라우저 공개 | 지도 표시용 제한된 키 |
| `NEXT_PUBLIC_SUPABASE_URL` | 브라우저 공개 | Supabase 프로젝트 URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | 브라우저 공개 | Supabase 공개 키 |
| `SUPABASE_SECRET_KEY` | 서버 전용 | 공유 결과 저장 및 조회 |

## Guardrails

- 서버 전용 키에 `NEXT_PUBLIC_` 접두사를 사용하지 않는다.
- Google 브라우저 키는 허용된 도메인과 필요한 API로 제한한다.
- 서버 키는 필요한 API와 배포 환경으로 제한한다.
- API 호출 실패 시 사용자에게 재시도 가능한 메시지를 제공하고 `requestId`를
  로그에 남긴다.
- 모든 외부 API는 교체 가능한 어댑터 인터페이스 뒤에 둔다.

## References

- OpenAI `gpt-5.4-mini`: `https://developers.openai.com/api/docs/models/gpt-5.4-mini`
- OpenAI Structured Outputs:
  `https://platform.openai.com/docs/guides/structured-outputs`
- Google Maps Platform Pricing:
  `https://developers.google.com/maps/billing-and-pricing/overview`
- Vercel Hobby Plan: `https://vercel.com/docs/accounts/plans/hobby`
- Supabase Billing: `https://supabase.com/docs/guides/platform/billing-on-supabase`
