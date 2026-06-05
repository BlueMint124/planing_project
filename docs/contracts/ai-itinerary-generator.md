# AI Itinerary Generator Contract

This contract defines the boundary between normalized trip inputs, provider
candidates, route hints, and the OpenAI itinerary generator.

## Code Source

- `src/features/ai/itinerary-prompt.ts`
- `src/features/ai/openai-itinerary-generator.ts`
- `src/features/ai/trip-itinerary-generator.ts`
- `src/features/ai/cost-summary.ts`

## Inputs

`createTripItineraryGenerator` accepts a validated `TripGenerationRequest` and
uses injected providers:

- `PlaceProvider.searchPlaces({ destination, styles, maxResults })`
- `RouteProvider.computeRoute({ origin, destination })`
- `AIItineraryGenerator.generate({ request, places, routeHints })`

The default maximum place candidate count is `12`.

## Prompt Rules

`buildItineraryPrompt` creates deterministic system and user prompt sections.

- Optimization priority order is fixed:
  1. route efficiency
  2. budget compliance
  3. group preference balance
- The prompt may include member likes and dislikes, but not member names.
- The model must use only provided place candidates.
- The model must not invent coordinates or booking URLs.
- Consecutive excessive category repetition is discouraged.
- `route[].estimatedCost` is a per-person KRW estimate.

## Structured Output

The model is called through the OpenAI Responses API using Structured Outputs
via `zodTextFormat`.

The internal API response contract remains `TripGenerationResponse` from
`src/features/trips/contracts.ts`.

OpenAI Structured Outputs require all schema fields to be required. Because the
public API contract has optional `route[].bookingUrl`, the OpenAI-only schema
uses `bookingUrl: string | null`, then normalizes `null` back to an omitted
`bookingUrl` before returning the shared API response.

## Cost Summary

The generator does not trust the model's cost summary. After validating the
model route output, it recalculates:

- `estimatedCostPerPerson`: sum of `route[].estimatedCost`
- `totalEstimatedCost`: `estimatedCostPerPerson * groupSize`
- `budgetStatus`: `within_budget` when per-person cost is less than or equal to
  `budgetPerPerson`; otherwise `over_budget`

## Failure Behavior

- Fewer than two place candidates throws
  `Not enough place candidates to generate an itinerary.`
- Invalid AI output throws `AI itinerary output failed schema validation.`
- Provider and OpenAI errors are allowed to bubble to the trip generation service,
  which converts them to user-safe `GENERATION_FAILED` responses.

## Current Integration Status

The live route handler now instantiates:

- Google Places provider
- Google Routes provider
- OpenAI client
- `createTripItineraryGenerator`

`DEMO_MODE=true` behavior remains unchanged for presentation safety. Live smoke
testing with real API keys is still pending.
