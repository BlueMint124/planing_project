# Collaborator Prompt: Generation Status UI

```text
AGENTS.md와 docs/collaboration/prompts/collaborator-start.md의 규칙을 따라줘.

이번 작업 기능은 생성 로딩 및 실패 UI야.
브랜치는 codex/generation-status-ui를 사용해.

먼저 DESIGN.md와 docs/ui-design/screens.md의 일정 생성 상태 화면만 읽어.

구현 범위:
- 일정 생성 중 상태 패널
- 진행 단계와 최대 30초 안내
- 생성 실패 상태 패널
- requestId 표시
- 동일 조건 재시도와 입력 조건 수정 버튼
- aria-live를 포함한 접근성 처리
- 관련 컴포넌트 테스트

제외 범위:
- 실제 API 호출과 재시도 로직
- 오류 로그 적재
- AI 생성
- 공통 타입 및 계약 변경

완료 조건:
- 생성 중과 실패 상태가 명확히 구분된다.
- 사용자가 실패 후 두 복구 경로를 이해할 수 있다.
- 내부 오류 원문이나 비밀 정보가 표시되지 않는다.
- work-board와 docs/handoffs/generation-status-ui.md를 갱신하고 브랜치를 push한다.
```
