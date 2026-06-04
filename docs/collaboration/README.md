# Codex Collaboration Guide

이 저장소는 서로 다른 PC에서 작업하는 두 명의 개발자와 Codex가 GitHub를 통해
맥락을 공유한다. Codex 대화 내용은 다른 PC에 자동으로 전달되지 않으므로, 저장소에
커밋된 문서와 코드, Pull Request를 공유 메모리로 사용한다.

## Core Rules

1. `main` 브랜치에 직접 커밋하거나 직접 푸시하지 않는다.
2. 작업 하나마다 `codex/<feature-name>` 기능 브랜치를 만든다.
3. 작업 시작 전에 최신 `main`을 받고 작업 보드에 담당 기능을 등록한다.
4. 다른 작업자가 사용하는 파일과 계약을 임의로 변경하지 않는다.
5. API, 데이터 타입, 상태 모델 변경은 코드보다 먼저 계약 문서에 기록한다.
6. 기능이 완료되면 테스트 결과와 남은 맥락을 handoff 문서에 기록한다.
7. 기능 브랜치를 원격에 푸시하고 Pull Request를 통해서만 `main`에 반영한다.
8. 다른 작업자는 PR의 계약 변경, 테스트 결과, 남은 작업을 확인한 뒤 리뷰한다.

## Source Of Truth

- `AGENTS.md`: 모든 Codex가 지켜야 하는 저장소 작업 규칙
- `todo.md`: 제품 전체 백로그와 완료 조건
- `docs/collaboration/work-board.md`: 현재 담당자, 브랜치, 상태, 의존성, PR
- `docs/contracts/`: 프론트엔드와 백엔드가 함께 사용하는 계약
- `docs/handoffs/`: 기능별 작업 맥락과 인수인계 기록
- GitHub Pull Request: 코드 리뷰, 검증 결과, 병합 이력

대화에서만 합의한 내용은 결정으로 간주하지 않는다. 다른 Codex가 읽어야 하는 정보는
반드시 위 소스 오브 트루스 중 하나에 기록하고 커밋한다.

## First-Time Setup On Each PC

```powershell
git clone https://github.com/BlueMint124/planing_project.git
cd planing_project
git switch main
git pull --ff-only origin main
```

각 PC는 별도의 clone을 사용한다. 하나의 작업 폴더를 네트워크 드라이브나 동기화
폴더로 공유하지 않는다.

## Starting A Feature

1. 최신 상태를 확인한다.

```powershell
git switch main
git pull --ff-only origin main
git status
```

2. `docs/collaboration/work-board.md`에서 다른 작업자의 진행 중 기능과 의존성을
   확인한다.
3. 새 기능 브랜치를 만든다.

```powershell
git switch -c codex/<feature-name>
```

4. 작업 보드에 담당자, 브랜치, 상태, 의존성을 등록하고 먼저 커밋 및 푸시한다.
5. Codex에게 다음 시작 프롬프트를 제공한다.

```text
AGENTS.md, todo.md, docs/collaboration/README.md,
docs/collaboration/work-board.md, 관련 계약 문서와 handoff 문서,
최근 커밋을 먼저 읽어줘.

내 담당 기능은 <기능명>이고 브랜치는 codex/<feature-name>이야.
다른 기능의 계약을 임의로 변경하지 말고, 변경이 필요하면 계약 문서와
work-board.md에 먼저 기록해줘.
구현과 검증 후 handoff 문서, todo.md, PR 설명을 갱신해줘.
```

## During Development

- 작은 기능 단위로 구현, 테스트, 커밋, 푸시한다.
- 다른 브랜치의 코드가 필요하면 해당 PR이 병합될 때까지 기다리거나 명시적인 계약을
  기준으로 테스트 더블을 사용한다.
- 공통 파일 변경이 필요하면 작업 보드의 `Shared File Lock`에 먼저 기록한다.
- 공통 계약 변경이 필요하면 영향을 받는 작업자를 작업 보드에 기록하고 PR 설명에
  명시한다.
- `main`의 변경을 받아야 할 때는 기능 브랜치에서 최신 `main`을 병합하거나
  리베이스하되, 이미 공유한 커밋을 재작성하지 않는다.

## Finishing A Feature

1. 관련 테스트, 타입 검사, 린트, 빌드를 실행한다.
2. `docs/handoffs/<feature-name>.md`를 작성하거나 갱신한다.
3. `todo.md`와 작업 보드의 상태를 갱신한다.
4. 변경 사항을 논리적 커밋으로 만들고 기능 브랜치를 푸시한다.
5. GitHub에서 Pull Request를 생성한다.
6. 다른 작업자가 PR을 리뷰하고, 충돌과 계약 영향을 확인한 뒤 병합한다.
7. 병합 후 작업 보드 항목을 완료 상태로 갱신한다.

## Conflict Prevention

- 두 작업자가 같은 기능 브랜치를 공유하지 않는다.
- `AGENTS.md`, `todo.md`, 공통 설정 파일, 계약 문서는 동시에 수정하지 않는 것을
  원칙으로 한다.
- 공통 파일을 수정해야 하는 작업자는 `Shared File Lock`에 파일과 예상 해제 시점을
  기록한다.
- 충돌이 발생하면 최신 `main`의 의도를 보존하고, 상대 작업자의 변경을 삭제하지
  않는다.
- 충돌 해결 후 관련 테스트를 다시 실행한다.

## Pull Request Review Checklist

- 변경 범위가 하나의 기능 또는 논리적 작업에 집중되어 있는가?
- 계약 변경이 `docs/contracts/`에 기록되어 있는가?
- 다른 진행 중 작업에 영향을 주는 변경이 설명되어 있는가?
- 정상, 예외, 실패 흐름의 테스트가 있는가?
- 검증 명령과 결과가 PR에 기록되어 있는가?
- `todo.md`, 작업 보드, handoff 문서가 현재 상태를 반영하는가?
- 비밀키, 개인정보, 불필요한 로그가 포함되지 않았는가?

