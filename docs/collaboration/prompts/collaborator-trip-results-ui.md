# Collaborator Prompt: Trip Results UI

```text
AGENTS.md와 docs/collaboration/prompts/collaborator-start.md의 규칙을 따라줘.

이번 작업 기능은 여행 결과 카드 UI야.
브랜치는 codex/trip-result-cards를 사용해.

구현 범위:
- 저장소의 제주 mock 결과를 사용하는 결과 화면
- 총 예상 비용과 1인당 예상 비용 요약
- 예산 상태 표시
- 일자별 추천 일정과 장소 카드
- 장소 시간, 카테고리, 예상 비용, 이동 시간 표시
- 예약 링크 버튼
- AI 추천 정보 면책 안내
- 관련 컴포넌트 테스트

제외 범위:
- 실제 API 호출
- Google 지도 렌더링
- 공유 결과 저장
- AI 생성
- 공통 타입 및 계약 변경

완료 조건:
- mock 결과의 비용과 일정이 사용자가 이해할 수 있게 표시된다.
- 예약 링크 버튼이 안전한 외부 링크 동작을 사용한다.
- 모바일 화면에서 결과 카드가 깨지지 않는다.
- 관련 테스트가 통과한다.
- work-board와 docs/handoffs/trip-result-cards.md를 갱신하고 브랜치를 push한다.
```
