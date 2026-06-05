import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DemoPlanner } from "./DemoPlanner";
import type { TripApiClient } from "@/src/features/trips/api-client";
import {
  travelStyleSchema,
  tripDurationSchema,
} from "@/src/features/trips/contracts";
import { mockJejuTripResponse } from "@/src/features/trips/mock-trip";

function createClient(overrides: Partial<TripApiClient> = {}): TripApiClient {
  return {
    generateTrip: vi.fn().mockResolvedValue(mockJejuTripResponse),
    shareTrip: vi.fn().mockResolvedValue({
      tripId: mockJejuTripResponse.tripId,
      shareUrl: "https://example.test/share/trip_demo_jeju_001",
      expiresAt: "2026-06-12T00:00:00.000Z",
    }),
    getSharedTrip: vi.fn().mockResolvedValue({
      trip: mockJejuTripResponse,
      expiresAt: "2026-06-12T00:00:00.000Z",
    }),
    ...overrides,
  };
}

describe("DemoPlanner", () => {
  it("generates a demo trip and exposes the result actions", async () => {
    const user = userEvent.setup();
    const client = createClient();

    render(<DemoPlanner apiClient={client} />);

    expect(
      screen.getByRole("heading", { name: "어디로 떠날까요?" }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "AI 일정 생성" }));

    expect(await screen.findByText("추천 일정")).toBeInTheDocument();
    expect(screen.getByText("총 예상 비용")).toBeInTheDocument();
    expect(screen.getByText("좌표 기반 동선")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "공유하기" })).toBeEnabled();
    expect(client.generateTrip).toHaveBeenCalledWith(
      expect.objectContaining({
        destination: "제주",
        groupSize: 4,
      }),
    );
  });

  it("creates and displays a share URL for a generated trip", async () => {
    const user = userEvent.setup();
    const client = createClient();

    render(<DemoPlanner apiClient={client} />);

    await user.click(screen.getByRole("button", { name: "AI 일정 생성" }));
    await user.click(await screen.findByRole("button", { name: "공유하기" }));

    expect(
      await screen.findByText("https://example.test/share/trip_demo_jeju_001"),
    ).toBeInTheDocument();
    expect(client.shareTrip).toHaveBeenCalledWith(mockJejuTripResponse);
  });

  it("shows a recoverable error when generation fails", async () => {
    const user = userEvent.setup();
    const client = createClient({
      generateTrip: vi.fn().mockRejectedValue(new Error("network")),
    });

    render(<DemoPlanner apiClient={client} />);

    await user.click(screen.getByRole("button", { name: "AI 일정 생성" }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "일정을 생성하지 못했어요.",
      );
    });
  });

  it("submits edited duration, styles, and member preferences", async () => {
    const user = userEvent.setup();
    const client = createClient();

    render(<DemoPlanner apiClient={client} />);

    await user.click(screen.getByLabelText("2박 3일"));
    await user.click(screen.getByLabelText("카페"));
    await user.click(screen.getByLabelText("맛집"));
    await user.click(screen.getByRole("button", { name: "멤버 추가" }));
    await user.clear(screen.getByLabelText("3번 멤버 이름"));
    await user.type(screen.getByLabelText("3번 멤버 이름"), "지민");
    await user.type(screen.getByLabelText("3번 멤버 선호"), "카페, 사진");
    await user.type(screen.getByLabelText("3번 멤버 비선호"), "등산");

    await user.click(screen.getByRole("button", { name: "AI 일정 생성" }));

    expect(client.generateTrip).toHaveBeenCalledWith(
      expect.objectContaining({
        duration: tripDurationSchema.options[2],
        styles: expect.arrayContaining([travelStyleSchema.options[1]]),
        members: expect.arrayContaining([
          {
            name: "지민",
            likes: ["카페", "사진"],
            dislikes: ["등산"],
          },
        ]),
      }),
    );
    expect(client.generateTrip).not.toHaveBeenCalledWith(
      expect.objectContaining({
        styles: expect.arrayContaining([travelStyleSchema.options[0]]),
      }),
    );
  });

  it("lets users retry after a failed generation", async () => {
    const user = userEvent.setup();
    const client = createClient({
      generateTrip: vi
        .fn()
        .mockRejectedValueOnce(new Error("network"))
        .mockResolvedValueOnce(mockJejuTripResponse),
    });

    render(<DemoPlanner apiClient={client} />);

    await user.click(screen.getByRole("button", { name: "AI 일정 생성" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "일정을 생성하지 못했어요.",
    );

    await user.click(screen.getByRole("button", { name: "다시 시도" }));

    expect(await screen.findByText("추천 일정")).toBeInTheDocument();
    expect(client.generateTrip).toHaveBeenCalledTimes(2);
  });

  it("regenerates a trip from the current result state", async () => {
    const user = userEvent.setup();
    const client = createClient();

    render(<DemoPlanner apiClient={client} />);

    await user.click(screen.getByRole("button", { name: "AI 일정 생성" }));
    await screen.findByText("추천 일정");
    await user.click(screen.getByRole("button", { name: "현재 조건으로 재생성" }));

    expect(client.generateTrip).toHaveBeenCalledTimes(2);
  });
});
