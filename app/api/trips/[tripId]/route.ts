import { NextResponse } from "next/server";

import {
  createDefaultTripShareStore,
  type TripShareStore,
} from "@/src/features/shares/trip-share-store";

interface GetSharedTripHandlerDependencies {
  store: TripShareStore;
  now: () => Date;
}

interface GetSharedTripContext {
  params: Promise<{
    tripId: string;
  }>;
}

function notFound() {
  return NextResponse.json(
    {
      errorCode: "SHARED_TRIP_NOT_FOUND",
      message: "공유된 여행 결과를 찾을 수 없습니다.",
    },
    { status: 404 },
  );
}

export function createGetSharedTripHandler(
  dependencies: GetSharedTripHandlerDependencies,
) {
  return async function GET(_request: Request, context: GetSharedTripContext) {
    const { tripId } = await context.params;
    const record = await dependencies.store.findByTripId(
      tripId,
      dependencies.now(),
    );

    if (!record) {
      return notFound();
    }

    return NextResponse.json({
      trip: record.trip,
      expiresAt: record.expiresAt.toISOString(),
    });
  };
}

export const GET = createGetSharedTripHandler({
  store: createDefaultTripShareStore(process.env),
  now: () => new Date(),
});
