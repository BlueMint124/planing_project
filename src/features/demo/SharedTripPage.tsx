"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  createHttpTripApiClient,
  type TripApiClient,
} from "@/src/features/trips/api-client";
import type { TripGenerationResponse } from "@/src/features/trips/contracts";
import { TripResultView } from "./TripResultView";

interface SharedTripPageProps {
  tripId: string;
  apiClient?: TripApiClient;
}

export function SharedTripPage({ tripId, apiClient }: SharedTripPageProps) {
  const resolvedApiClient = useMemo(
    () => apiClient ?? createHttpTripApiClient(),
    [apiClient],
  );
  const [trip, setTrip] = useState<TripGenerationResponse | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadTrip() {
      setIsLoading(true);
      setError(null);

      try {
        const shared = await resolvedApiClient.getSharedTrip(tripId);

        if (isMounted) {
          setTrip(shared.trip);
          setExpiresAt(shared.expiresAt);
          setError(null);
        }
      } catch {
        if (isMounted) {
          setTrip(null);
          setExpiresAt(null);
          setError("공유된 여행 결과를 찾을 수 없습니다.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadTrip();

    return () => {
      isMounted = false;
    };
  }, [resolvedApiClient, tripId]);

  return (
    <main className="demo-shell shared-shell">
      {isLoading ? (
        <section className="empty-state">
          <p className="eyebrow">LOADING</p>
          <h1>공유된 여행 일정을 불러오는 중입니다</h1>
        </section>
      ) : null}

      {!isLoading && error ? (
        <section className="empty-state" role="alert">
          <p className="eyebrow">NOT FOUND</p>
          <h1>{error}</h1>
          <p>링크가 만료되었거나 잘못된 주소일 수 있습니다.</p>
          <Link className="home-link" href="/">
            새 여행 일정 만들기
          </Link>
        </section>
      ) : null}

      {!isLoading && trip ? (
        <TripResultView
          expiresAt={expiresAt ?? undefined}
          title="공유된 여행 일정"
          trip={trip}
        />
      ) : null}
    </main>
  );
}
