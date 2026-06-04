# Trip Generation API Contract

## Endpoint

- Method: `POST`
- Path: `/api/trips/generate`
- Content Type: `application/json`

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

## Code Source Of Truth

- `src/features/trips/contracts.ts`
- `src/features/trips/mock-trip.ts`
- `src/features/trips/api-client.ts`
- `src/features/trips/trip-form.ts`
