# Trip Generation API Contract

## Endpoint

- Method: `POST`
- Path: `/api/trips/generate`
- Content Type: `application/json`
- Route Handler: `app/api/trips/generate/route.ts`

## Demo And Live Behavior

- `DEMO_MODE=true`: 외부 API를 호출하지 않고 검증된 제주 mock 결과를 반환한다.
- `DEMO_MODE`가 `true`가 아니면 현재는 실제 생성기가 구성되지 않았으므로
  `GENERATION_FAILED` 응답을 반환한다.
- 후속 AI 및 장소 연동은 동일한 요청과 응답 계약을 유지해야 한다.

## Request

```json
{
  "destination": "제주",
  "duration": "1박2일",
  "budgetPerPerson": 200000,
  "groupSize": 4,
  "styles": ["자연", "맛집", "힐링"],
  "members": [
    {
      "name": "멤버1",
      "likes": ["카페", "사진"],
      "dislikes": ["등산"]
    }
  ]
}
```

| 필드 | 타입 | 필수 | 규칙 |
| --- | --- | --- | --- |
| `destination` | string | 예 | 공백 제거 후 1~50자 |
| `duration` | string enum | 예 | 당일치기, 1박2일, 2박3일, 3박4일 |
| `budgetPerPerson` | integer | 예 | 0보다 큰 1인당 예산 |
| `groupSize` | integer | 예 | 2~10 |
| `styles` | array | 예 | 허용 여행 스타일에서 최소 1개 |
| `members` | array | 아니오 | 최대 10명, 비어 있으면 대표 스타일 적용 |

허용 여행 스타일:

`맛집`, `카페`, `자연`, `액티비티`, `쇼핑`, `역사/문화`, `힐링`, `사진`,
`아이동반`, `부모님동반`

## Success Response

```json
{
  "tripId": "trip_demo_jeju_001",
  "summary": {
    "totalEstimatedCost": 720000,
    "estimatedCostPerPerson": 180000,
    "budgetStatus": "within_budget"
  },
  "route": [
    {
      "day": 1,
      "order": 1,
      "time": "10:00",
      "placeName": "성산일출봉",
      "category": "자연",
      "estimatedCost": 5000,
      "moveMinutesFromPrevious": 0,
      "bookingUrl": "https://www.google.com/maps/search/?api=1&query=성산일출봉",
      "coordinates": {
        "lat": 33.4581,
        "lng": 126.9425
      }
    }
  ]
}
```

| 필드 | 타입 | 규칙 |
| --- | --- | --- |
| `tripId` | string | 공유 결과 식별자 |
| `summary.totalEstimatedCost` | integer | 0 이상 |
| `summary.estimatedCostPerPerson` | integer | 0 이상 |
| `summary.budgetStatus` | enum | `within_budget`, `over_budget` |
| `route` | array | 최소 1개 장소 |
| `route[].coordinates` | object | 위도와 경도 |
| `route[].bookingUrl` | URL | 선택 필드 |

## Failure Response

```json
{
  "errorCode": "GENERATION_FAILED",
  "message": "일정을 생성하지 못했습니다. 잠시 후 다시 시도해주세요.",
  "requestId": "req_123"
}
```

## Status Codes

| 상태 코드 | 오류 코드 | 의미 |
| --- | --- | --- |
| `200` | 없음 | 일정 생성 성공 |
| `400` | `INVALID_REQUEST` | 필수값 누락 또는 잘못된 입력값 |
| `500` | `GENERATION_FAILED` | 생성기 실패, AI 실패, 잘못된 생성 결과 |

## Logging

서버 로그에는 다음 필드를 기록한다.

- `event`
- `requestId`
- `createdAt`
- `inputSummary`
- `responseTimeMs`
- `failureCode`

`inputSummary`에는 목적지, 기간, 예산, 인원, 스타일, 멤버 수만 포함한다. 멤버 이름,
원본 선호 정보, 비밀키, 내부 오류 원문은 로그에 남기지 않는다.

## Code Source Of Truth

- `src/features/trips/contracts.ts`
- `src/features/trips/mock-trip.ts`
- `src/features/trips/api-client.ts`
- `src/features/trips/trip-form.ts`
- `src/features/trips/generation-service.ts`
- `app/api/trips/generate/route.ts`
