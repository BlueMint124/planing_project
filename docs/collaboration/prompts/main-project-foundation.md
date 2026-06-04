# Main Developer Prompt: Project Foundation

```text
AGENTS.md와 docs/collaboration/prompts/main-developer-start.md의 규칙을 따라줘.

이번 작업 기능은 프로젝트 골격과 공통 계약이야.
브랜치는 codex/project-foundation을 사용해.

먼저 읽을 문서:
- docs/design-docs/technology-stack.md
- docs/collaboration/feature-ownership.md
- docs/contracts/README.md
- 원본 기능 명세서

구현 범위:
- Next.js App Router + TypeScript 프로젝트 생성
- npm 패키지 관리 설정
- Tailwind CSS와 shadcn/ui 기본 설정
- React Hook Form과 Zod 설치 및 기본 연결
- Vitest, React Testing Library, Playwright, ESLint, Prettier 설정
- 여행 생성 요청, 성공 응답, 실패 응답, 상태 모델의 공통 TypeScript 타입
- 공통 Zod 스키마
- docs/contracts/trip-generation-api.md 작성
- docs/contracts/trip-state-model.md 작성
- 제주 고정 mock 요청과 mock 결과
- UI가 사용할 API 클라이언트 인터페이스
- DEMO_MODE를 포함한 .env.example
- npm run dev, test, lint, typecheck, build 명령
- README 또는 개발 시작 문서

제외 범위:
- 실제 OpenAI API 호출
- 실제 Google Places 및 Routes API 호출
- 실제 Supabase 저장
- 완성된 입력 화면과 결과 화면

완료 조건:
- npm install 후 로컬 앱이 실행된다.
- test, lint, typecheck, build 명령이 통과한다.
- 협업자가 실제 외부 API 없이 공통 타입과 제주 mock 데이터로 UI를 개발할 수 있다.
- 계약 문서와 코드 타입이 일치한다.
- todo.md, work-board.md, docs/handoffs/project-foundation.md를 갱신한다.
- 브랜치를 push하고 Pull Request를 준비한다.
```

