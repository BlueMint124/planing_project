# Share Trip Results Contract

This contract defines temporary storage and lookup for generated trip results.

## Endpoints

### `POST /api/trips/share`

Stores a validated `TripGenerationResponse` and returns a share URL.

Success response:

```json
{
  "tripId": "trip_demo_jeju_001",
  "shareUrl": "https://example.com/share/trip_demo_jeju_001",
  "expiresAt": "2026-06-12T00:00:00.000Z"
}
```

Failure response:

```json
{
  "errorCode": "INVALID_SHARE_RESULT",
  "message": "공유할 여행 결과를 확인해주세요."
}
```

### `GET /api/trips/[tripId]`

Looks up a non-expired shared trip result.

Success response:

```json
{
  "trip": {
    "tripId": "trip_demo_jeju_001",
    "summary": {},
    "route": []
  },
  "expiresAt": "2026-06-12T00:00:00.000Z"
}
```

Failure response:

```json
{
  "errorCode": "SHARED_TRIP_NOT_FOUND",
  "message": "공유된 여행 결과를 찾을 수 없습니다."
}
```

## Storage Policy

- MVP shared results expire after 7 days.
- Shared results store only `TripGenerationResponse`.
- Original trip request, member names, likes/dislikes, and secret values are not
  stored in the share record.
- `tripId` is treated as an unguessable public lookup key.

## Runtime Store Selection

`createDefaultTripShareStore(process.env)` chooses:

- Supabase store when `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SECRET_KEY` are set.
- Process-local in-memory store when Supabase keys are missing.

The in-memory fallback exists for local development and presentation demo safety.
It is not durable across server restarts.

## Supabase Table

Expected table name: `trip_shares`.

Suggested SQL:

```sql
create table if not exists trip_shares (
  trip_id text primary key,
  trip_result jsonb not null,
  created_at timestamptz not null,
  expires_at timestamptz not null
);

create index if not exists trip_shares_expires_at_idx
  on trip_shares (expires_at);
```

The server uses `SUPABASE_SECRET_KEY`; do not expose it with a `NEXT_PUBLIC_`
prefix.

## Code Source Of Truth

- `src/features/shares/trip-share-store.ts`
- `app/api/trips/share/route.ts`
- `app/api/trips/[tripId]/route.ts`
