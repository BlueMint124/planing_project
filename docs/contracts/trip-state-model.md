# Trip State Model Contract

## States

| 상태 | 의미 | 허용 동작 |
| --- | --- | --- |
| `draft` | 입력 중 | 입력 수정 |
| `validating` | 입력 검증 중 | 대기 |
| `generating` | 일정 생성 중 | 대기 또는 취소 |
| `generated` | 일정 생성 완료 | 공유, 재생성, 예약 링크 이동 |
| `failed` | 일정 생성 실패 | 동일 조건 재시도 또는 입력 수정 |
| `shared` | 공유 동작 수행 | 공유 결과 조회 |

## Allowed Transitions

```text
draft -> validating
validating -> generating
validating -> draft
generating -> generated
generating -> failed
generated -> shared
failed -> validating
failed -> draft
```

UI와 서버는 상태를 임의로 추정하지 않고 이 값을 명시적으로 사용한다.

## Code Source Of Truth

- `src/features/trips/contracts.ts`
