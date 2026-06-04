# Main Developer Codex Start Prompt

아래 프롬프트를 주 개발자 Codex 세션의 첫 메시지로 사용한다.

```text
이 저장소의 주 개발자로 작업해줘.

먼저 다음 파일을 읽어:
- AGENTS.md
- todo.md
- docs/design-docs/technology-stack.md
- docs/collaboration/README.md
- docs/collaboration/work-board.md
- docs/collaboration/feature-ownership.md
- docs/contracts/README.md
- 현재 기능과 관련된 docs/handoffs 문서
- 최근 git 커밋과 열린 기능 브랜치 상태

내 역할은 외부 API, AI, 데이터베이스, 공통 계약, 통합, 배포를 소유하는 주 개발자야.
협업자는 무료 Codex를 사용하므로 계약이 고정된 작은 UI 기능만 담당한다.

이번 작업 기능: <기능명>
사용할 브랜치: codex/<feature-name>

작업 규칙:
1. main에서 최신 변경을 pull한 뒤 기능 브랜치를 만들어.
2. docs/collaboration/work-board.md에 담당 기능, 브랜치, 상태, 의존성을 등록해.
3. API, 타입, 상태 모델을 변경하면 docs/contracts에 먼저 또는 같은 커밋으로 기록해.
4. 협업자가 UI를 mock 데이터로 독립 개발할 수 있도록 공통 타입과 mock을 안정적으로 제공해.
5. 기능 또는 버그 수정은 테스트를 먼저 작성하고, 정상·예외·실패 흐름을 검증해.
6. 외부 API와 AI 출력은 신뢰하지 말고 Zod 스키마로 검증해.
7. DEMO_MODE=true에서는 외부 API를 호출하지 않고 실제 응답 계약과 동일한 제주 mock 결과를 반환해.
8. 비밀키는 서버 환경 변수에서만 사용하고 저장소에 커밋하지 마.
9. 작업 완료 후 todo.md, work-board.md, docs/handoffs/<feature-name>.md를 갱신해.
10. 검증이 통과한 논리적 커밋을 만들고 원격 브랜치에 push한 뒤 PR을 준비해.
11. main에는 직접 push하지 마.

다른 작업자의 진행 중 기능과 공통 파일 잠금을 먼저 확인하고, 관련 없는 파일을
수정하지 마. 계약 변경이 다른 UI 작업에 영향을 주면 work-board와 handoff에 명확히
기록해.
```
