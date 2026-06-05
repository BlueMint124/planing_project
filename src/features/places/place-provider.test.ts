import { describe, expect, it } from "vitest";
import {
  buildPlaceSearchQueries,
  createAdjacentDestinationQueries,
} from "./place-provider";

describe("buildPlaceSearchQueries", () => {
  it("builds destination-aware category queries for selected styles", () => {
    expect(
      buildPlaceSearchQueries({
        destination: "제주",
        styles: ["자연", "맛집", "힐링"],
      }),
    ).toEqual(["제주 자연 명소", "제주 맛집", "제주 힐링 명소"]);
  });

  it("limits duplicate categories while preserving order", () => {
    expect(
      buildPlaceSearchQueries({
        destination: "제주",
        styles: ["자연", "자연", "카페"],
      }),
    ).toEqual(["제주 자연 명소", "제주 카페"]);
  });
});

describe("createAdjacentDestinationQueries", () => {
  it("creates fallback queries for adjacent destinations", () => {
    expect(
      createAdjacentDestinationQueries({
        adjacentDestinations: ["서귀포", "애월"],
        categoryLabel: "카페",
      }),
    ).toEqual(["서귀포 카페", "애월 카페"]);
  });
});
