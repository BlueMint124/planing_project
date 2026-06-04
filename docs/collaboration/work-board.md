# Collaboration Work Board

이 문서는 현재 진행 중인 작업의 소유권과 의존성을 빠르게 확인하기 위한 요약판이다.
상세 구현 맥락은 `docs/handoffs/`와 Pull Request에 기록한다.

## Status

- `planned`: 담당 전 또는 시작 전
- `in-progress`: 구현 진행 중
- `blocked`: 외부 결정이나 다른 기능이 필요함
- `review`: Pull Request 리뷰 대기
- `done`: `main`에 병합 완료

## Active Work

| 기능 | 담당자 | 브랜치 | 상태 | 의존성 | Handoff | PR |
| --- | --- | --- | --- | --- | --- | --- |
| 협업 하네스 | Codex | `codex/collaboration-harness` | review | 없음 | `docs/handoffs/collaboration-harness.md` | 생성 예정 |

## Shared File Lock

공통 파일을 수정하기 전에 행을 추가하고, 작업이 끝나면 제거한다. 잠금은 기술적 강제가
아니라 충돌 방지를 위한 협업 신호다.

| 파일 또는 경로 | 작업자 | 브랜치 | 이유 | 예상 해제 |
| --- | --- | --- | --- | --- |

## Coordination Notes

- API와 데이터 타입의 기준은 `docs/contracts/`에 기록한다.
- 작업 보드는 요약만 유지한다. 긴 설명은 handoff 문서에 작성한다.
- 완료된 작업은 행을 삭제하지 않고 상태를 `done`으로 바꿔 이력을 보존한다.
