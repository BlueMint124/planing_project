import { zodResolver } from "@hookform/resolvers/zod";
import {
  type TripGenerationRequest,
  tripGenerationRequestSchema,
} from "./contracts";

export const tripFormDefaultValues: TripGenerationRequest = {
  destination: "",
  duration: "1박2일",
  budgetPerPerson: 0,
  groupSize: 2,
  styles: [],
  members: [],
};

export const tripFormResolver = zodResolver(tripGenerationRequestSchema);
