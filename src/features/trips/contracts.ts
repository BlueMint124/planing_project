import { z } from "zod";

export const tripDurationSchema = z.enum([
  "당일치기",
  "1박2일",
  "2박3일",
  "3박4일",
]);

export const travelStyleSchema = z.enum([
  "맛집",
  "카페",
  "자연",
  "액티비티",
  "쇼핑",
  "역사/문화",
  "힐링",
  "사진",
  "아이동반",
  "부모님동반",
]);

export const tripMemberSchema = z.object({
  name: z.string().trim().min(1).max(50),
  likes: z.array(z.string().trim().min(1).max(50)).max(20).default([]),
  dislikes: z.array(z.string().trim().min(1).max(50)).max(20).default([]),
});

export const tripGenerationRequestSchema = z.object({
  destination: z.string().trim().min(1).max(50),
  duration: tripDurationSchema,
  budgetPerPerson: z.number().int().positive(),
  groupSize: z.number().int().min(2).max(10),
  styles: z.array(travelStyleSchema).min(1),
  members: z.array(tripMemberSchema).max(10).default([]),
});

export const coordinatesSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

export const routeItemSchema = z.object({
  day: z.number().int().positive(),
  order: z.number().int().positive(),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  placeName: z.string().trim().min(1),
  category: z.string().trim().min(1),
  estimatedCost: z.number().int().nonnegative(),
  moveMinutesFromPrevious: z.number().int().nonnegative(),
  bookingUrl: z.url().optional(),
  coordinates: coordinatesSchema,
});

export const tripGenerationResponseSchema = z.object({
  tripId: z.string().trim().min(1),
  summary: z.object({
    totalEstimatedCost: z.number().int().nonnegative(),
    estimatedCostPerPerson: z.number().int().nonnegative(),
    budgetStatus: z.enum(["within_budget", "over_budget"]),
  }),
  route: z.array(routeItemSchema).min(1),
});

export const tripGenerationErrorSchema = z.object({
  errorCode: z.string().trim().min(1),
  message: z.string().trim().min(1),
  requestId: z.string().trim().min(1),
});

export const tripStateSchema = z.enum([
  "draft",
  "validating",
  "generating",
  "generated",
  "failed",
  "shared",
]);

export type TripDuration = z.infer<typeof tripDurationSchema>;
export type TravelStyle = z.infer<typeof travelStyleSchema>;
export type TripMember = z.infer<typeof tripMemberSchema>;
export type TripGenerationRequest = z.infer<typeof tripGenerationRequestSchema>;
export type Coordinates = z.infer<typeof coordinatesSchema>;
export type RouteItem = z.infer<typeof routeItemSchema>;
export type TripGenerationResponse = z.infer<typeof tripGenerationResponseSchema>;
export type TripGenerationError = z.infer<typeof tripGenerationErrorSchema>;
export type TripState = z.infer<typeof tripStateSchema>;
