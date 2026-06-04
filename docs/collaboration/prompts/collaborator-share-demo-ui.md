# Collaborator Prompt: Share And Demo UI

```text
AGENTS.md와 docs/collaboration/prompts/collaborator-start.md의 규칙을 따라줘.

이번 작업 기능은 공유 및 데모 화면 마감이야.
브랜치는 codex/share-demo-ui를 사용해.

먼저 DESIGN.md와 docs/ui-design/screens.md의 공유 결과 및 Shared Empty And Demo
States 섹션만 읽어.

구현 범위:
- 읽기 전용 공유 결과 화면 표현
- 공유받은 일정 안내와 생성 시각 표시
- 공유 링크 복사 성공 토스트
- 만료 또는 없는 공유 결과 안내
- 새 일정 만들기 버튼
- DEMO 배지와 예시 데이터 레이블
- AI 추천 정보 면책 안내
- 관련 컴포넌트 테스트

제외 범위:
- 공유 결과 저장 및 조회 API
- 실제 링크 복사 서버 로직
- AI 생성
- 공통 타입 및 계약 변경

완료 조건:
- 공유 화면에서 입력 수정과 재생성 액션이 보이지 않는다.
- 만료된 결과에서 새 일정 생성 경로를 제공한다.
- 데모 데이터가 실제 사용자 입력으로 오해되지 않는다.
- work-board와 docs/handoffs/share-demo-ui.md를 갱신하고 브랜치를 push한다.
```
