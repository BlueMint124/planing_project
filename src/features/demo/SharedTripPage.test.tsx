import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SharedTripPage } from "./SharedTripPage";
import type { TripApiClient } from "@/src/features/trips/api-client";
import { mockJejuTripResponse } from "@/src/features/trips/mock-trip";

function createClient(overrides: Partial<TripApiClient> = {}): TripApiClient {
  return {
    generateTrip: vi.fn(),
    shareTrip: vi.fn(),
    getSharedTrip: vi.fn().mockResolvedValue({
      trip: mockJejuTripResponse,
      expiresAt: "2026-06-12T00:00:00.000Z",
    }),
    ...overrides,
  };
}

describe("SharedTripPage", () => {
  it("loads and renders a shared trip result", async () => {
    const client = createClient();

    render(<SharedTripPage apiClient={client} tripId="trip_demo_jeju_001" />);

    expect(
      screen.getByRole("heading", { name: "공유된 여행 일정을 불러오는 중입니다" }),
    ).toBeInTheDocument();
    expect(await screen.findByText("공유된 여행 일정")).toBeInTheDocument();
    expect(screen.getByText(/공유 결과 만료 시각/)).toBeInTheDocument();
    expect(client.getSharedTrip).toHaveBeenCalledWith("trip_demo_jeju_001");
  });

  it("shows a not found state when the shared result cannot be loaded", async () => {
    const client = createClient({
      getSharedTrip: vi.fn().mockRejectedValue(new Error("not found")),
    });

    render(<SharedTripPage apiClient={client} tripId="missing" />);

    expect(
      await screen.findByRole("heading", {
        name: "공유된 여행 결과를 찾을 수 없습니다.",
      }),
    ).toBeInTheDocument();
  });
});
