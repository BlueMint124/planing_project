# Collaboration Harness Handoff

## Ownership

- 담당자: Codex
- 브랜치: `codex/collaboration-harness`
- 상태: review
- Pull Request: 생성 예정
- 마지막 갱신: 2026-06-04

## Goal

서로 다른 PC에서 작업하는 두 개발자와 Codex가 GitHub 저장소를 공유 메모리로
사용하도록 협업 규칙, 작업 보드, 계약 문서, 인수인계 문서, PR 템플릿을 제공한다.

## Completed

- 협업 가이드 문서 작성
- 작업 소유권과 의존성을 관리하는 작업 보드 작성
- 공통 계약 문서 디렉터리와 변경 규칙 작성
- 기능별 handoff 템플릿과 저장 위치 작성
- Pull Request 템플릿 작성
- `AGENTS.md`와 `todo.md`에 협업 문서 연결
- Next.js, Vercel, Supabase, OpenAI, Google Maps 기반 기술 스택 결정 문서 작성
- 발표용 `DEMO_MODE` 운영 방침 작성
- 토큰 예산을 고려한 기능별 담당 범위 작성
- 주 개발자와 제한 토큰 협업자용 시작 프롬프트 작성
- 프로젝트 골격과 첫 협업자 UI 작업의 전용 프롬프트 작성
- 데스크톱 Smart Dashboard 디자인 시스템과 화면별 UI 명세 작성
- 입력, 취향, 생성 상태, 결과 화면의 시각 참조 이미지 추가

## Changed Contracts

- 없음

## Key Files

- `docs/collaboration/README.md`: 전체 협업 흐름
- `docs/collaboration/work-board.md`: 담당자, 브랜치, 상태, 의존성
- `docs/collaboration/handoff-template.md`: 기능별 인수인계 템플릿
- `docs/contracts/README.md`: 공통 계약 변경 규칙
- `docs/design-docs/technology-stack.md`: 기술 스택과 데모 모드
- `docs/collaboration/feature-ownership.md`: 기능 분담과 의존성
- `docs/collaboration/prompts/`: 역할별 Codex 시작 프롬프트
- `DESIGN.md`: UI 디자인 시스템
- `docs/ui-design/screens.md`: 화면별 UI 개발 명세

## Verification

| 명령 | 결과 |
| --- | --- |
| `git diff --check` | 통과 |

## Remaining Work

- 기능 브랜치 푸시
- Pull Request 생성 및 리뷰

## Known Issues And Risks

- GitHub의 `main` 브랜치 보호 규칙은 저장소 관리자 설정이 필요하다.

## Next Agent Start Prompt

```text
AGENTS.md, todo.md, docs/collaboration/README.md,
docs/collaboration/work-board.md, 이 handoff 문서를 먼저 읽어줘.
협업 하네스가 현재 개발 흐름과 일치하는지 확인하고, 필요한 문서 갱신을 진행해줘.
```
