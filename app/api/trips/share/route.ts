import { NextResponse } from "next/server";

import {
  createDefaultTripShareStore,
  getDefaultShareExpiration,
  type TripShareStore,
} from "@/src/features/shares/trip-share-store";
import { tripGenerationResponseSchema } from "@/src/features/trips/contracts";

interface ShareTripPostHandlerDependencies {
  store: TripShareStore;
  now: () => Date;
}

function invalidShareResult() {
  return NextResponse.json(
    {
      errorCode: "INVALID_SHARE_RESULT",
      message: "공유할 여행 결과를 확인해주세요.",
    },
    { status: 400 },
  );
}

export function createShareTripPostHandler(
  dependencies: ShareTripPostHandlerDependencies,
) {
  return async function POST(request: Request) {
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return invalidShareResult();
    }

    const parsed = tripGenerationResponseSchema.safeParse(body);

    if (!parsed.success) {
      return invalidShareResult();
    }

    const createdAt = dependencies.now();
    const expiresAt = getDefaultShareExpiration(createdAt);

    await dependencies.store.save({
      tripId: parsed.data.tripId,
      trip: parsed.data,
      createdAt,
      expiresAt,
    });

    const origin = new URL(request.url).origin;

    return NextResponse.json(
      {
        tripId: parsed.data.tripId,
        shareUrl: `${origin}/share/${parsed.data.tripId}`,
        expiresAt: expiresAt.toISOString(),
      },
      { status: 201 },
    );
  };
}

export const POST = createShareTripPostHandler({
  store: createDefaultTripShareStore(process.env),
  now: () => new Date(),
});
