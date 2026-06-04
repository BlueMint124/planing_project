# Trip Input UI Handoff

## Ownership

- 담당자: 제한 토큰 협업자
- 브랜치: `codex/trip-input-ui`
- 상태: blocked
- Pull Request: 없음
- 마지막 갱신: 2026-06-04

## Goal

모바일 우선 단계형 여행 조건 입력 UI를 구현하는 것이 목표였지만, 현재 저장소에는 이 기능이
소비해야 할 프로젝트 골격과 공통 폼 타입, mock 데이터가 아직 병합되어 있지 않아 시작할 수
없다.

## Completed

- 작업 보드에 `trip-input-ui`를 `blocked`로 등록했다.
- 선행 의존성이 아직 없음을 확인했다.

## Changed Contracts

- 없음

## Key Files

- `AGENTS.md`: 협업 규칙과 토큰 절약 지침
- `docs/collaboration/work-board.md`: 현재 상태와 의존성
- `docs/handoffs/trip-input-ui.md`: 이 기능의 현재 인수인계
- `todo.md`: 제품 전체 백로그와 완료 조건

## Verification

| 명령 | 결과 |
| --- | --- |
| `git pull --ff-only origin main` | pass |
| `git ls-remote --heads origin` | pass, `codex/project-foundation` 브랜치 없음 |
| `git ls-tree -r --name-only origin/main` | pass, 현재 main에는 `AGENTS.md`와 `todo.md`만 존재 |

## Remaining Work

- `codex/project-foundation`을 `main`에 병합한 뒤 다시 시작한다.
- Next.js App Router, Vitest, React Testing Library, 공통 폼 타입, mock 데이터, UI 클라이언트 인터페이스가 준비되어야 한다.
- 준비 후 모바일 우선 입력 UI, 빈 상태, 로딩, 접근성, 관련 테스트를 구현한다.

## Known Issues And Risks

- 현재 원격에는 `main`과 `codex/collaboration-harness`만 존재한다.
- UI가 사용할 공통 계약과 앱 스캐폴딩이 없어 임의 구현을 하면 다른 협업자와 충돌할 수 있다.
- 백엔드, AI, DB, 외부 API는 이번 기능 범위가 아니므로 건드리지 않는다.

## Next Agent Start Prompt

```text
AGENTS.md, todo.md, docs/collaboration/README.md,
docs/collaboration/work-board.md, 이 handoff 문서와 관련 계약 문서를 먼저 읽어줘.
`codex/project-foundation`이 `main`에 병합된 뒤 여행 조건 입력 UI를 다시 시작해줘.
```
