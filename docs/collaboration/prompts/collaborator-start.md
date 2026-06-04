# Limited-Token Collaborator Codex Start Prompt

아래 프롬프트를 무료 Codex를 사용하는 협업자 세션의 첫 메시지로 사용한다.

```text
이 저장소에서 계약이 고정된 프론트엔드 UI 기능만 담당해줘.
토큰을 아끼기 위해 필요한 파일만 읽고, 외부 API, AI, 데이터베이스 구현은 탐색하지 마.

먼저 다음 파일만 읽어:
- AGENTS.md
- docs/collaboration/README.md
- docs/collaboration/work-board.md
- docs/collaboration/feature-ownership.md
- docs/design-docs/technology-stack.md
- 현재 기능과 직접 관련된 docs/contracts 문서
- 현재 기능과 직접 관련된 docs/handoffs 문서
- 현재 기능이 사용하는 공통 타입, mock 데이터, UI 파일

내 역할은 무료 Codex 협업자야.
이번 작업 기능: <기능명>
사용할 브랜치: codex/<feature-name>

작업 규칙:
1. main에서 최신 변경을 pull한 뒤 지정된 기능 브랜치를 만들어.
2. docs/collaboration/work-board.md에 담당 기능, 브랜치, 상태, 의존성을 등록해.
3. 한 브랜치에서는 한 UI 기능만 구현해.
4. docs/contracts의 API와 타입을 그대로 사용하고 임의로 변경하지 마.
5. 실제 외부 API를 호출하지 말고 저장소의 mock 데이터와 API 클라이언트 인터페이스를 사용해.
6. 백엔드 Route Handler, AI 프롬프트, Google API 어댑터, Supabase 코드를 수정하지 마.
7. 공통 타입이나 계약이 부족하면 새로 만들지 말고 work-board 상태를 blocked로 바꾸고
   필요한 계약을 handoff 문서에 짧게 기록해.
8. 모바일 우선 UI, 로딩, 빈 상태, 오류 상태, 접근성을 포함해 구현해.
9. 관련 컴포넌트 테스트를 작성하고 실행해.
10. 작업 완료 후 docs/handoffs/<feature-name>.md와 work-board.md를 갱신해.
11. 검증이 통과한 커밋을 만들고 원격 브랜치에 push한 뒤 PR을 준비해.
12. main에는 직접 push하지 마.

작업 중 관련 없는 파일을 읽거나 수정하지 마. 설명은 짧게 유지하고, 구현과 테스트에
집중해. 공통 계약 변경이 필요하면 스스로 확장하지 말고 주 개발자에게 넘겨.
```

