import type { TravelStyle } from "@/src/features/trips/contracts";

export interface PlaceCandidate {
  id: string;
  name: string;
  category: string;
  formattedAddress?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  bookingUrl?: string;
  estimatedCost?: number;
}

export interface PlaceSearchRequest {
  destination: string;
  styles: TravelStyle[];
  maxResults?: number;
}

export interface PlaceProvider {
  searchPlaces(request: PlaceSearchRequest): Promise<PlaceCandidate[]>;
}

const styleQueryLabels: Record<TravelStyle, string> = {
  맛집: "맛집",
  카페: "카페",
  자연: "자연 명소",
  액티비티: "액티비티",
  쇼핑: "쇼핑",
  "역사/문화": "역사 문화 명소",
  힐링: "힐링 명소",
  사진: "사진 명소",
  아이동반: "아이와 갈만한 곳",
  부모님동반: "부모님과 갈만한 곳",
};

export function getStyleQueryLabel(style: TravelStyle) {
  return styleQueryLabels[style];
}

export function buildPlaceSearchQueries(request: {
  destination: string;
  styles: TravelStyle[];
}) {
  const uniqueStyles = Array.from(new Set(request.styles));
  return uniqueStyles.map(
    (style) => `${request.destination} ${getStyleQueryLabel(style)}`,
  );
}

export function createAdjacentDestinationQueries(request: {
  adjacentDestinations: string[];
  categoryLabel: string;
}) {
  return request.adjacentDestinations.map(
    (destination) => `${destination} ${request.categoryLabel}`,
  );
}
