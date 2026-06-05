import { NextResponse } from "next/server";

interface HealthGetHandlerDependencies {
  env: Record<string, string | undefined>;
  now: () => Date;
}

function isConfigured(value: string | undefined) {
  return Boolean(value && value.trim().length > 0);
}

export function createHealthGetHandler(dependencies: HealthGetHandlerDependencies) {
  return async function GET() {
    return NextResponse.json({
      status: "ok",
      checkedAt: dependencies.now().toISOString(),
      mode: dependencies.env.DEMO_MODE === "true" ? "demo" : "live",
      dependencies: {
        openaiConfigured: isConfigured(dependencies.env.OPENAI_API_KEY),
        googleMapsConfigured: isConfigured(dependencies.env.GOOGLE_MAPS_API_KEY),
        supabaseConfigured:
          isConfigured(dependencies.env.NEXT_PUBLIC_SUPABASE_URL) &&
          isConfigured(dependencies.env.SUPABASE_SECRET_KEY),
      },
    });
  };
}

export const GET = createHealthGetHandler({
  env: process.env,
  now: () => new Date(),
});
