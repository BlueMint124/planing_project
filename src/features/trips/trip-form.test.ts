import { describe, expect, it } from "vitest";
import { tripFormDefaultValues, tripFormResolver } from "./trip-form";

describe("trip form foundation", () => {
  it("provides defaults that match the product rules", () => {
    expect(tripFormDefaultValues).toEqual({
      destination: "",
      duration: "1박2일",
      budgetPerPerson: 0,
      groupSize: 2,
      styles: [],
      members: [],
    });
  });

  it("connects React Hook Form to the shared Zod validation", async () => {
    const result = await tripFormResolver(tripFormDefaultValues, undefined, {
      criteriaMode: "firstError",
      fields: {},
      names: [],
      shouldUseNativeValidation: false,
    });

    expect(result.errors.destination).toBeDefined();
    expect(result.errors.budgetPerPerson).toBeDefined();
    expect(result.errors.styles).toBeDefined();
  });
});
