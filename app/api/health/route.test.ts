import { describe, expect, it } from "vitest";

import { createHealthGetHandler } from "./route";

describe("GET /api/health", () => {
  it("returns service status and sanitized dependency configuration", async () => {
    const handler = createHealthGetHandler({
      env: {
        DEMO_MODE: "false",
        OPENAI_API_KEY: "secret-openai",
        GOOGLE_MAPS_API_KEY: "secret-google",
        NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
        SUPABASE_SECRET_KEY: "secret-supabase",
      },
      now: () => new Date("2026-06-05T12:00:00.000Z"),
    });

    const response = await handler();

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      status: "ok",
      checkedAt: "2026-06-05T12:00:00.000Z",
      mode: "live",
      dependencies: {
        openaiConfigured: true,
        googleMapsConfigured: true,
        supabaseConfigured: true,
      },
    });
  });

  it("reports demo mode without exposing missing or present secret values", async () => {
    const handler = createHealthGetHandler({
      env: {
        DEMO_MODE: "true",
        OPENAI_API_KEY: "secret-openai",
      },
      now: () => new Date("2026-06-05T12:00:00.000Z"),
    });

    const response = await handler();
    const bodyText = await response.text();

    expect(response.status).toBe(200);
    expect(bodyText).toContain('"mode":"demo"');
    expect(bodyText).toContain('"openaiConfigured":true');
    expect(bodyText).not.toContain("secret-openai");
  });
});
