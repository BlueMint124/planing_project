"use client";

import type { TripGenerationResponse } from "@/src/features/trips/contracts";

interface TripResultViewProps {
  trip: TripGenerationResponse;
  title?: string;
  expiresAt?: string;
}

function formatKrw(value: number) {
  return new Intl.NumberFormat("ko-KR").format(value);
}

function groupRouteByDay(route: TripGenerationResponse["route"]) {
  return route.reduce<Record<number, TripGenerationResponse["route"]>>(
    (days, item) => {
      days[item.day] = [...(days[item.day] ?? []), item];
      return days;
    },
    {},
  );
}

export function TripResultView({
  trip,
  title = "추천 일정",
  expiresAt,
}: TripResultViewProps) {
  const routeByDay = groupRouteByDay(trip.route);
  const orderedDays = Object.keys(routeByDay)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <section className="result-panel" aria-label={title}>
      <div className="panel-header">
        <div>
          <p className="eyebrow">AI ROUTE RESULT</p>
          <h2>{title}</h2>
          <p className="panel-copy">
            이동 시간, 예산, 단체 취향을 함께 고려한 발표용 추천 일정입니다.
          </p>
        </div>
        <span className="trip-id">{trip.tripId}</span>
      </div>

      <div className="summary-grid">
        <article className="metric-card">
          <span>총 예상 비용</span>
          <strong>{formatKrw(trip.summary.totalEstimatedCost)}원</strong>
        </article>
        <article className="metric-card">
          <span>1인당 예상 비용</span>
          <strong>{formatKrw(trip.summary.estimatedCostPerPerson)}원</strong>
        </article>
        <article className="metric-card">
          <span>예산 상태</span>
          <strong>
            {trip.summary.budgetStatus === "within_budget"
              ? "예산 내"
              : "예산 초과"}
          </strong>
        </article>
      </div>

      {expiresAt ? (
        <p className="expiry-note">
          공유 결과 만료 시각: {new Date(expiresAt).toLocaleString("ko-KR")}
        </p>
      ) : null}

      <div className="result-layout">
        <div className="timeline">
          {orderedDays.map((day) => (
            <article className="day-card" key={day}>
              <h3>{day}일차</h3>
              <div className="route-list">
                {routeByDay[day].map((item) => (
                  <div className="route-item" key={`${item.day}-${item.order}`}>
                    <div className="route-time">{item.time}</div>
                    <div>
                      <div className="route-title">
                        <strong>{item.placeName}</strong>
                        <span>{item.category}</span>
                      </div>
                      <p>
                        이전 장소에서 {item.moveMinutesFromPrevious}분 이동 · 예상{" "}
                        {formatKrw(item.estimatedCost)}원
                      </p>
                      {item.bookingUrl ? (
                        <a
                          href={item.bookingUrl}
                          rel="noreferrer"
                          target="_blank"
                        >
                          외부 상세 링크 열기
                        </a>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>

        <aside className="map-card" aria-label="지도 좌표 요약">
          <div>
            <p className="eyebrow">ROUTE MAP</p>
            <h3>좌표 기반 동선</h3>
            <p>
              발표 MVP에서는 지도 SDK 대신 방문 순서와 좌표를 먼저 보여줍니다.
            </p>
          </div>
          <ol>
            {trip.route.map((item) => (
              <li key={`${item.day}-${item.order}-${item.placeName}`}>
                <span>{item.order}</span>
                <div>
                  <strong>{item.placeName}</strong>
                  <small>
                    {item.coordinates.lat.toFixed(4)},{" "}
                    {item.coordinates.lng.toFixed(4)}
                  </small>
                </div>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </section>
  );
}
