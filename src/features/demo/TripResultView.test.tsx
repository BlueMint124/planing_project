import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { mockJejuTripResponse } from "@/src/features/trips/mock-trip";

import { TripResultView } from "./TripResultView";

describe("TripResultView", () => {
  it("renders a presentation route map with path pins and place labels", () => {
    render(<TripResultView trip={mockJejuTripResponse} />);

    const map = screen.getByRole("img", { name: "제주 여행 경로 지도" });

    expect(map).toBeInTheDocument();
    expect(within(map).getByText("성산일출봉")).toBeInTheDocument();
    expect(within(map).getByText("아르떼뮤지엄 제주")).toBeInTheDocument();
    expect(screen.getByLabelText("1번 경유지 김포공항 출발")).toBeInTheDocument();
    expect(
      screen.getByLabelText("2번 경유지 제주공항 도착 및 렌터카 픽업"),
    ).toBeInTheDocument();
  });
});
