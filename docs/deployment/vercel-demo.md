# Vercel Demo Deployment

This document is the deployment checklist for the MVP demo.

## Recommended Demo Settings

For presentation stability, set:

```text
DEMO_MODE=true
OPENAI_MODEL=gpt-5.4-mini
```

With `DEMO_MODE=true`, `POST /api/trips/generate` returns the validated Jeju mock
trip without calling OpenAI, Google Maps, or Supabase.

## Optional Live Settings

Live generation needs server-only keys:

```text
OPENAI_API_KEY=
GOOGLE_MAPS_API_KEY=
SUPABASE_SECRET_KEY=
```

Browser-safe public settings:

```text
NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

Do not add `NEXT_PUBLIC_` to server-only keys.

## Supabase Table

Create the table from `docs/contracts/share-trip-results.md` before enabling
durable shared result storage. Without Supabase keys, the app uses a process-local
in-memory fallback for local development and demo safety.

## Health Check

After deployment, open:

```text
https://<deployment-url>/api/health
```

Expected shape:

```json
{
  "status": "ok",
  "checkedAt": "2026-06-05T00:00:00.000Z",
  "mode": "demo",
  "dependencies": {
    "openaiConfigured": false,
    "googleMapsConfigured": false,
    "supabaseConfigured": false
  }
}
```

The health response only reports booleans and never returns secret values.

## CI Gate

GitHub Actions runs on pull requests and pushes to `main`:

- `npm run test`
- `npm run lint`
- `npm run build`
- `npm run typecheck`

`typecheck` runs after `build` because Next.js generates `.next/types` during the
build step.
