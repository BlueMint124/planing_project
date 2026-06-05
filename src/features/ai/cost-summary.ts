import type { TripGenerationResponse } from "@/src/features/trips/contracts";

type CostRouteItem = Pick<
  TripGenerationResponse["route"][number],
  "estimatedCost"
>;

export function calculateTripCostSummary(input: {
  route: CostRouteItem[];
  groupSize: number;
  budgetPerPerson: number;
}): TripGenerationResponse["summary"] {
  const estimatedCostPerPerson = input.route.reduce(
    (sum, item) => sum + item.estimatedCost,
    0,
  );

  return {
    totalEstimatedCost: estimatedCostPerPerson * input.groupSize,
    estimatedCostPerPerson,
    budgetStatus:
      estimatedCostPerPerson <= input.budgetPerPerson
        ? "within_budget"
        : "over_budget",
  };
}
