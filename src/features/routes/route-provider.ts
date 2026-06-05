import type { Coordinates } from "@/src/features/trips/contracts";

export interface RouteRequest {
  origin: Coordinates;
  destination: Coordinates;
}

export interface RouteResult {
  distanceMeters: number;
  durationMinutes: number;
}

export interface RouteProvider {
  computeRoute(request: RouteRequest): Promise<RouteResult>;
}
