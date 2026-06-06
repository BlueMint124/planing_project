"use client";

import {
  Camera,
  CarFront,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Flag,
  Leaf,
  MapPinned,
  Plane,
  Utensils,
  WalletCards,
} from "lucide-react";

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

function getRouteCategories(route: TripGenerationResponse["route"]) {
  return Array.from(new Set(route.map((item) => item.category))).slice(0, 4);
}

function groupCostsByCategory(route: TripGenerationResponse["route"]) {
  return Array.from(
    route
      .reduce<Map<string, number>>((costs, item) => {
        costs.set(item.category, (costs.get(item.category) ?? 0) + item.estimatedCost);
        return costs;
      }, new Map())
      .entries(),
  )
    .filter(([, cost]) => cost > 0)
    .sort(([, leftCost], [, rightCost]) => rightCost - leftCost);
}

function getCategoryIcon(category: string) {
  if (category.includes("항공")) {
    return Plane;
  }

  if (category.includes("교통") || category.includes("이동")) {
    return CarFront;
  }

  if (category.includes("맛") || category.includes("식")) {
    return Utensils;
  }

  if (category.includes("사진")) {
    return Camera;
  }

  if (category.includes("자연") || category.includes("힐")) {
    return Leaf;
  }

  return MapPinned;
}

const presentationMapAnchors = [
  {
    match: ["김포", "공항 출발"],
    label: "김포공항",
    x: 12,
    y: 72,
  },
  {
    match: ["제주공항", "공항 도착", "공항 복귀"],
    label: "제주공항",
    x: 36,
    y: 38,
  },
  {
    match: ["성산", "섭지코지"],
    label: "성산권",
    x: 76,
    y: 50,
  },
  {
    match: ["동문", "제주 4.3", "돌문화", "비자림", "함덕"],
    label: "제주시권",
    x: 50,
    y: 36,
  },
  {
    match: ["아르떼", "애월"],
    label: "애월/서부권",
    x: 24,
    y: 62,
  },
];

function findMapAnchor(item: TripGenerationResponse["route"][number]) {
  return (
    presentationMapAnchors.find((anchor) =>
      anchor.match.some((keyword) => item.placeName.includes(keyword)),
    ) ?? presentationMapAnchors[1]
  );
}

function createPresentationMapPoints(route: TripGenerationResponse["route"]) {
  const seen = new Set<string>();

  return route
    .map((item, index) => ({
      ...item,
      index,
      anchor: findMapAnchor(item),
    }))
    .filter((point) => {
      if (seen.has(point.anchor.label)) {
        return false;
      }

      seen.add(point.anchor.label);
      return true;
    })
    .slice(0, 5)
    .map((point, visualIndex) => ({
      ...point,
      visualIndex,
      x: point.anchor.x,
      y: point.anchor.y,
      label: point.anchor.label,
    }));
}

function buildRoutePath(
  points: ReturnType<typeof createPresentationMapPoints>,
) {
  return points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");
}

function PresentationRouteMap({
  route,
}: {
  route: TripGenerationResponse["route"];
}) {
  const points = createPresentationMapPoints(route);
  const routePath = buildRoutePath(points);

  return (
    <div
      aria-label="제주 여행 경로 지도"
      className="route-map-visual presentation-map"
      role="img"
    >
      <svg viewBox="0 0 100 100" role="presentation">
        <defs>
          <linearGradient id="jejuLand" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#e9f7df" />
            <stop offset="100%" stopColor="#fbfff8" />
          </linearGradient>
          <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="3" floodOpacity="0.14" stdDeviation="2" />
          </filter>
        </defs>
        <rect
          className="sea-panel"
          height="100"
          rx="12"
          width="100"
          x="0"
          y="0"
        />
        <path
          className="jeju-island-shape"
          d="M18 53 C22 39 36 30 54 31 C73 32 88 42 89 54 C90 66 75 74 55 76 C34 78 15 66 18 53Z"
          fill="url(#jejuLand)"
          filter="url(#softShadow)"
        />
        <path
          className="jeju-coast-line"
          d="M23 54 C28 45 38 39 54 40 C69 41 80 47 82 55 C75 62 66 66 54 66 C41 66 31 62 23 54Z"
          fill="none"
        />
        <path
          className="jeju-mountain"
          d="M46 58 L53 44 L61 58Z"
          fill="#b8d5b6"
          opacity="0.78"
        />
        <path
          className="presentation-route-path"
          d={routePath}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {points.map((point) => (
          <g
            aria-label={`${point.index + 1}번 경유지 ${point.placeName}`}
            className="presentation-map-pin"
            key={`${point.day}-${point.order}-${point.placeName}`}
            role="img"
            style={{
              transform: `translate(${point.x}px, ${point.y}px)`,
            }}
          >
            <circle r="4.8" />
            <text dy="1.4" textAnchor="middle">
              {point.visualIndex + 1}
            </text>
          </g>
        ))}
      </svg>
      <span className="presentation-map-caption">발표용 경로 예시</span>
      {points.map((point) => (
        <span
          className="presentation-map-label"
          key={`label-${point.day}-${point.order}-${point.placeName}`}
          style={{
            left: `${point.x}%`,
            top: `${point.y}%`,
          }}
        >
          {point.label}
        </span>
      ))}
    </div>
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
  const categories = getRouteCategories(trip.route);
  const categoryCosts = groupCostsByCategory(trip.route);
  const totalMoveMinutes = trip.route.reduce(
    (sum, item) => sum + item.moveMinutesFromPrevious,
    0,
  );

  return (
    <section className="result-panel" aria-label={title}>
      <div className="result-hero">
        <div className="destination-badge" aria-hidden="true">
          <Flag size={34} />
        </div>
        <div className="result-title-block">
          <p className="eyebrow">AI ROUTE RESULT</p>
          <h2>{title}</h2>
          <p>
            이동 시간, 예산, 단체 취향을 함께 고려한 우리만의 여행 일정입니다.
          </p>
          <div className="result-chip-row" aria-label="일정 핵심 태그">
            {categories.map((category) => {
              const Icon = getCategoryIcon(category);
              return (
                <span className="result-chip" key={category}>
                  <Icon aria-hidden="true" size={16} />
                  {category}
                </span>
              );
            })}
            <span className="result-chip muted">
              <Clock3 aria-hidden="true" size={16} />
              총 이동 약 {totalMoveMinutes}분
            </span>
          </div>
        </div>
        <span className="trip-id">{trip.tripId}</span>
      </div>

      <div className="summary-grid">
        <article className="metric-card">
          <WalletCards aria-hidden="true" size={20} />
          <span>총 예상 비용</span>
          <strong>{formatKrw(trip.summary.totalEstimatedCost)}원</strong>
        </article>
        <article className="metric-card">
          <WalletCards aria-hidden="true" size={20} />
          <span>1인당 예상 비용</span>
          <strong>{formatKrw(trip.summary.estimatedCostPerPerson)}원</strong>
        </article>
        <article className="metric-card">
          <CheckCircle2 aria-hidden="true" size={20} />
          <span>예산 상태</span>
          <strong>
            {trip.summary.budgetStatus === "within_budget"
              ? "예산 내"
              : "예산 초과"}
          </strong>
        </article>
      </div>

      <div className="cost-breakdown" aria-label="비용 반영 항목">
        <div>
          <p className="eyebrow">COST INCLUDED</p>
          <h3>비용 반영 항목</h3>
        </div>
        <div className="cost-chip-row">
          {categoryCosts.map(([category, cost]) => {
            const Icon = getCategoryIcon(category);
            return (
              <span className="cost-chip" key={category}>
                <Icon aria-hidden="true" size={16} />
                {category} {formatKrw(cost)}원
              </span>
            );
          })}
        </div>
      </div>

      {expiresAt ? (
        <p className="expiry-note">
          공유 결과 만료 시각: {new Date(expiresAt).toLocaleString("ko-KR")}
        </p>
      ) : null}

      <div className="result-layout">
        <div className="timeline">
          <div className="day-tabs" aria-label="일자 선택">
            {orderedDays.map((day, index) => (
              <span className={index === 0 ? "active" : ""} key={day}>
                DAY {day}
              </span>
            ))}
          </div>
          {orderedDays.map((day) => (
            <article className="day-card" key={day}>
              <h3>{day}일차 일정</h3>
              <div className="route-list">
                {routeByDay[day].map((item) => (
                  <div className="route-item" key={`${item.day}-${item.order}`}>
                    <div className="route-time">
                      <strong>{item.time}</strong>
                      <small>
                        {item.moveMinutesFromPrevious === 0
                          ? "출발"
                          : `${item.moveMinutesFromPrevious}분 이동`}
                      </small>
                    </div>
                    <div className="place-card">
                      <div className="place-thumb">
                        {(() => {
                          const Icon = getCategoryIcon(item.category);
                          return <Icon aria-hidden="true" size={26} />;
                        })()}
                      </div>
                      <div className="route-title">
                        <strong>{item.placeName}</strong>
                        <span>{item.category}</span>
                      </div>
                      <p>
                        예상 비용 {formatKrw(item.estimatedCost)}원 · 좌표{" "}
                        {item.coordinates.lat.toFixed(3)},{" "}
                        {item.coordinates.lng.toFixed(3)}
                      </p>
                      {item.bookingUrl ? (
                        <a
                          href={item.bookingUrl}
                          rel="noreferrer"
                          target="_blank"
                        >
                          예약 링크 보기
                          <ExternalLink aria-hidden="true" size={14} />
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
            <h3>여행 경로 미리보기</h3>
            <p>
              실제 지도 SDK 대신 방문 순서와 좌표를 활용해 발표용 경로를
              시각화합니다.
            </p>
          </div>
          <PresentationRouteMap route={trip.route} />
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

      <div className="notice-card">
        <CarFront aria-hidden="true" size={20} />
        <p>
          일정과 비용은 AI가 추천한 예상 정보입니다. 실제 가격, 운영 시간, 예약
          가능 여부는 방문 전 외부 링크에서 확인해주세요.
        </p>
      </div>
    </section>
  );
}
