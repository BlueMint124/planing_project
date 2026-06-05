import { describe, expect, it } from "vitest";

import { mockJejuTripResponse } from "@/src/features/trips/mock-trip";

import {
  createInMemoryTripShareStore,
  getDefaultShareExpiration,
} from "./trip-share-store";

describe("createInMemoryTripShareStore", () => {
  it("saves and retrieves an unexpired shared trip result", async () => {
    const store = createInMemoryTripShareStore();
    const now = new Date("2026-06-05T00:00:00.000Z");
    const expiresAt = getDefaultShareExpiration(now);

    await store.save({
      tripId: mockJejuTripResponse.tripId,
      trip: mockJejuTripResponse,
      createdAt: now,
      expiresAt,
    });

    await expect(
      store.findByTripId(mockJejuTripResponse.tripId, now),
    ).resolves.toEqual({
      tripId: mockJejuTripResponse.tripId,
      trip: mockJejuTripResponse,
      createdAt: now,
      expiresAt,
    });
  });

  it("returns null for expired shared trip results", async () => {
    const store = createInMemoryTripShareStore();
    const createdAt = new Date("2026-06-01T00:00:00.000Z");
    const expiresAt = new Date("2026-06-02T00:00:00.000Z");

    await store.save({
      tripId: mockJejuTripResponse.tripId,
      trip: mockJejuTripResponse,
      createdAt,
      expiresAt,
    });

    await expect(
      store.findByTripId(
        mockJejuTripResponse.tripId,
        new Date("2026-06-03T00:00:00.000Z"),
      ),
    ).resolves.toBeNull();
  });
});
