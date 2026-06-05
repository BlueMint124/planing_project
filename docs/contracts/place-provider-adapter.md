# Place And Route Provider Adapter Contract

이 계약은 Google Places 및 Routes API를 직접 사용하는 코드를 어댑터 경계 뒤에 둔다.
AI 일정 생성기는 Google 응답이 아니라 이 문서의 정규화된 타입만 사용해야 한다.

## Place Provider

Code source:

- `src/features/places/place-provider.ts`
- `src/features/places/google-places-provider.ts`

### Input

```ts
interface PlaceSearchRequest {
  destination: string;
  styles: TravelStyle[];
  maxResults?: number;
}
```

### Output

```ts
interface PlaceCandidate {
  id: string;
  name: string;
  category: string;
  formattedAddress?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  bookingUrl?: string;
  estimatedCost?: number;
}
```

### Query Rules

- 여행 스타일을 목적지 기반 텍스트 검색 쿼리로 변환한다.
- 중복 스타일은 제거하고 입력 순서를 유지한다.
- 장소 데이터가 부족할 때는 `createAdjacentDestinationQueries`로 인접 지역 fallback
  검색어를 만들 수 있다.

## Google Places Adapter

- Endpoint: `POST https://places.googleapis.com/v1/places:searchText`
- Required header: `X-Goog-Api-Key`
- Required field mask:
  `places.id,places.displayName,places.formattedAddress,places.location,places.googleMapsUri,places.primaryType`
- Request body includes `textQuery`, `languageCode: "ko"`, `regionCode: "KR"`, and
  `pageSize`.

Google Places Text Search(New)는 field mask가 없으면 오류를 반환한다. 필요한 필드만
요청해 응답 크기, 지연 시간, 과금 범위를 제한한다.

## Route Provider

Code source:

- `src/features/routes/route-provider.ts`
- `src/features/routes/google-routes-provider.ts`

### Input

```ts
interface RouteRequest {
  origin: Coordinates;
  destination: Coordinates;
}
```

### Output

```ts
interface RouteResult {
  distanceMeters: number;
  durationMinutes: number;
}
```

## Google Routes Adapter

- Endpoint: `POST https://routes.googleapis.com/directions/v2:computeRoutes`
- Required header: `X-Goog-Api-Key`
- Required field mask: `routes.duration,routes.distanceMeters`
- Default travel mode: `DRIVE`
- Default routing preference: `TRAFFIC_AWARE`
- Units: `METRIC`

`duration`은 Google의 `"1234s"` 형식을 분 단위로 올림 변환한다.

## Failure Behavior

- Google Places가 실패하면 `Google Places request failed.`를 throw한다.
- Google Routes가 실패하면 `Google Routes request failed.`를 throw한다.
- Google Routes가 경로를 반환하지 않으면 `Google Routes did not return a route.`를
  throw한다.
- 사용자가 보는 오류 메시지 변환은 `trip-generation-api` 서비스 계층에서 처리한다.

## References

- Google Places Text Search(New):
  `https://developers.google.com/maps/documentation/places/web-service/text-search`
- Google Routes computeRoutes:
  `https://developers.google.com/maps/documentation/routes/reference/rest/v2/TopLevel/computeRoutes`
