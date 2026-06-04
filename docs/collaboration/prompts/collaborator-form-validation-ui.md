# Collaborator Prompt: Form Validation UI

```text
AGENTS.md와 docs/collaboration/prompts/collaborator-start.md의 규칙을 따라줘.

이번 작업 기능은 입력 검증 표시 UI야.
브랜치는 codex/form-validation-ui를 사용해.

먼저 DESIGN.md와 docs/ui-design/screens.md의 여행 기본 정보 입력 및 여행 취향 선택
화면의 States 섹션만 읽어.

구현 범위:
- 필드 하단 인라인 오류 메시지
- 첫 오류 필드 포커스 이동
- 필수 입력과 형식 오류의 시각적 구분
- 여행 스타일 미선택 안내
- 선호와 비선호 중복 안내
- 생성 버튼 활성 및 비활성 상태
- 오류 메시지와 필드의 접근성 연결
- 관련 컴포넌트 테스트

제외 범위:
- 서버 입력 검증
- API 오류 응답
- 공통 Zod 스키마 변경
- 공통 타입 및 계약 변경

완료 조건:
- 사용자가 어떤 값을 수정해야 하는지 필드 단위로 이해할 수 있다.
- 오류 상태가 색상만으로 전달되지 않는다.
- 키보드와 보조 기술로 오류를 확인할 수 있다.
- work-board와 docs/handoffs/form-validation-ui.md를 갱신하고 브랜치를 push한다.
```
