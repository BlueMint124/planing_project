import {
  buildPlaceSearchQueries,
  type PlaceCandidate,
  type PlaceProvider,
  type PlaceSearchRequest,
} from "./place-provider";

const GOOGLE_PLACES_TEXT_SEARCH_URL =
  "https://places.googleapis.com/v1/places:searchText";

export const googlePlacesFieldMask =
  "places.id,places.displayName,places.formattedAddress,places.location,places.googleMapsUri,places.primaryType";

interface GooglePlacesProviderOptions {
  apiKey: string;
  fetchImpl?: typeof fetch;
}

interface GoogleTextSearchPlace {
  id?: string;
  displayName?: { text?: string };
  formattedAddress?: string;
  location?: { latitude?: number; longitude?: number };
  googleMapsUri?: string;
  primaryType?: string;
}

interface GoogleTextSearchResponse {
  places?: GoogleTextSearchPlace[];
}

function normalizeGooglePlace(place: GoogleTextSearchPlace): PlaceCandidate | null {
  if (
    !place.id ||
    !place.displayName?.text ||
    typeof place.location?.latitude !== "number" ||
    typeof place.location?.longitude !== "number"
  ) {
    return null;
  }

  return {
    id: place.id,
    name: place.displayName.text,
    category: place.primaryType ?? "place",
    formattedAddress: place.formattedAddress,
    coordinates: {
      lat: place.location.latitude,
      lng: place.location.longitude,
    },
    bookingUrl: place.googleMapsUri,
  };
}

export function createGooglePlacesProvider(
  options: GooglePlacesProviderOptions,
): PlaceProvider {
  const fetchImpl = options.fetchImpl ?? fetch;

  return {
    async searchPlaces(request: PlaceSearchRequest) {
      const queries = buildPlaceSearchQueries(request);
      const pageSize = request.maxResults ?? 5;
      const places: PlaceCandidate[] = [];

      for (const textQuery of queries) {
        const response = await fetchImpl(GOOGLE_PLACES_TEXT_SEARCH_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": options.apiKey,
            "X-Goog-FieldMask": googlePlacesFieldMask,
          },
          body: JSON.stringify({
            textQuery,
            languageCode: "ko",
            regionCode: "KR",
            pageSize,
          }),
        });

        if (!response.ok) {
          throw new Error("Google Places request failed.");
        }

        const data = (await response.json()) as GoogleTextSearchResponse;

        for (const place of data.places ?? []) {
          const normalized = normalizeGooglePlace(place);
          if (normalized) {
            places.push(normalized);
          }
        }
      }

      return places;
    },
  };
}
