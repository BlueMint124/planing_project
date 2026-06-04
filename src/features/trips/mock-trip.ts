import {
  tripGenerationRequestSchema,
  tripGenerationResponseSchema,
} from "./contracts";

export const mockJejuTripRequest = tripGenerationRequestSchema.parse({
  destination: "제주",
  duration: "1박2일",
  budgetPerPerson: 200000,
  groupSize: 4,
  styles: ["자연", "맛집", "힐링"],
  members: [
    { name: "멤버1", likes: ["카페", "사진"], dislikes: ["등산"] },
    { name: "멤버2", likes: ["맛집", "자연"], dislikes: [] },
  ],
});

export const mockJejuTripResponse = tripGenerationResponseSchema.parse({
  tripId: "trip_demo_jeju_001",
  summary: {
    totalEstimatedCost: 720000,
    estimatedCostPerPerson: 180000,
    budgetStatus: "within_budget",
  },
  route: [
    {
      day: 1,
      order: 1,
      time: "10:00",
      placeName: "성산일출봉",
      category: "자연",
      estimatedCost: 5000,
      moveMinutesFromPrevious: 0,
      bookingUrl: "https://www.google.com/maps/search/?api=1&query=성산일출봉",
      coordinates: { lat: 33.4581, lng: 126.9425 },
    },
    {
      day: 1,
      order: 2,
      time: "12:30",
      placeName: "성산 해녀의 집",
      category: "맛집",
      estimatedCost: 30000,
      moveMinutesFromPrevious: 12,
      bookingUrl:
        "https://www.google.com/maps/search/?api=1&query=성산+해녀의+집",
      coordinates: { lat: 33.4712, lng: 126.931 },
    },
    {
      day: 1,
      order: 3,
      time: "15:00",
      placeName: "섭지코지",
      category: "자연",
      estimatedCost: 0,
      moveMinutesFromPrevious: 18,
      bookingUrl: "https://www.google.com/maps/search/?api=1&query=섭지코지",
      coordinates: { lat: 33.4239, lng: 126.9294 },
    },
    {
      day: 2,
      order: 1,
      time: "10:30",
      placeName: "아르떼뮤지엄 제주",
      category: "사진",
      estimatedCost: 20000,
      moveMinutesFromPrevious: 0,
      bookingUrl:
        "https://www.google.com/maps/search/?api=1&query=아르떼뮤지엄+제주",
      coordinates: { lat: 33.3965, lng: 126.3448 },
    },
    {
      day: 2,
      order: 2,
      time: "13:00",
      placeName: "애월 카페거리",
      category: "카페",
      estimatedCost: 15000,
      moveMinutesFromPrevious: 20,
      bookingUrl:
        "https://www.google.com/maps/search/?api=1&query=애월+카페거리",
      coordinates: { lat: 33.4627, lng: 126.3092 },
    },
    {
      day: 2,
      order: 3,
      time: "17:30",
      placeName: "동문시장",
      category: "맛집",
      estimatedCost: 25000,
      moveMinutesFromPrevious: 35,
      bookingUrl: "https://www.google.com/maps/search/?api=1&query=제주+동문시장",
      coordinates: { lat: 33.5126, lng: 126.5289 },
    },
  ],
});
