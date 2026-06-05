import { describe, expect, it } from "vitest";

import { calculateTripCostSummary } from "./cost-summary";

describe("calculateTripCostSummary", () => {
  it("calculates total and per-person costs from route item per-person estimates", () => {
    const summary = calculateTripCostSummary({
      groupSize: 4,
      budgetPerPerson: 50_000,
      route: [
        { estimatedCost: 10_000 },
        { estimatedCost: 15_000 },
        { estimatedCost: 5_000 },
      ],
    });

    expect(summary).toEqual({
      totalEstimatedCost: 120_000,
      estimatedCostPerPerson: 30_000,
      budgetStatus: "within_budget",
    });
  });

  it("marks the budget as over budget when per-person cost exceeds the budget", () => {
    const summary = calculateTripCostSummary({
      groupSize: 3,
      budgetPerPerson: 20_000,
      route: [{ estimatedCost: 12_000 }, { estimatedCost: 12_000 }],
    });

    expect(summary.budgetStatus).toBe("over_budget");
  });
});
