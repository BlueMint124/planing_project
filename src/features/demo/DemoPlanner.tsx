"use client";

import { type FormEvent, useState } from "react";
import {
  createHttpTripApiClient,
  type TripApiClient,
  type TripShareResponse,
} from "@/src/features/trips/api-client";
import type {
  TripGenerationRequest,
  TripGenerationResponse,
  TripState,
} from "@/src/features/trips/contracts";
import { mockJejuTripRequest } from "@/src/features/trips/mock-trip";
import { TripResultView } from "./TripResultView";

interface DemoPlannerProps {
  apiClient?: TripApiClient;
}

const styleLabels = ["자연", "맛집", "사진"];

function createDefaultRequest(): TripGenerationRequest {
  return {
    ...mockJejuTripRequest,
    destination: "제주",
  };
}

export function DemoPlanner({
  apiClient = createHttpTripApiClient(),
}: DemoPlannerProps) {
  const [request, setRequest] =
    useState<TripGenerationRequest>(createDefaultRequest);
  const [state, setState] = useState<TripState>("draft");
  const [trip, setTrip] = useState<TripGenerationResponse | null>(null);
  const [share, setShare] = useState<TripShareResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isGenerating = state === "generating";
  const canShare = Boolean(trip) && state !== "generating";

  async function handleGenerate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("generating");
    setError(null);
    setShare(null);

    try {
      const generated = await apiClient.generateTrip(request);
      setTrip(generated);
      setState("generated");
    } catch {
      setTrip(null);
      setState("failed");
      setError("일정을 생성하지 못했어요. 조건을 확인한 뒤 다시 시도해주세요.");
    }
  }

  async function handleShare() {
    if (!trip) {
      return;
    }

    try {
      const shared = await apiClient.shareTrip(trip);
      setShare(shared);
      setState("shared");
    } catch {
      setError("공유 링크를 만들지 못했어요. 잠시 후 다시 시도해주세요.");
    }
  }

  return (
    <main className="demo-shell">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">AI GROUP TRAVEL PLANNER</p>
          <h1>단체 여행 조건을 넣으면 AI가 일정과 동선을 정리합니다</h1>
          <p>
            발표 시연에 필요한 핵심 흐름을 한 화면에 모았습니다. 생성 결과는
            공유 링크로 다시 열 수 있고, 이후 실제 지도와 예약 연동으로 확장할 수
            있습니다.
          </p>
        </div>
        <div className="demo-status">
          <span>{state}</span>
          <strong>Demo MVP</strong>
        </div>
      </section>

      <div className="planner-grid">
        <form className="planner-card" onSubmit={handleGenerate}>
          <div className="panel-header">
            <div>
              <p className="eyebrow">TRIP CONDITIONS</p>
              <h2>어디로 떠날까요?</h2>
              <p className="panel-copy">
                지역, 예산, 인원을 바꾸면 같은 계약으로 API에 요청합니다.
              </p>
            </div>
          </div>

          <label className="field">
            <span>여행 지역</span>
            <input
              disabled={isGenerating}
              maxLength={50}
              onChange={(event) =>
                setRequest((current) => ({
                  ...current,
                  destination: event.target.value,
                }))
              }
              value={request.destination}
            />
          </label>

          <div className="field-row">
            <label className="field">
              <span>1인당 예산</span>
              <input
                disabled={isGenerating}
                min={1}
                onChange={(event) =>
                  setRequest((current) => ({
                    ...current,
                    budgetPerPerson: Number(event.target.value),
                  }))
                }
                type="number"
                value={request.budgetPerPerson}
              />
            </label>
            <label className="field">
              <span>인원</span>
              <input
                disabled={isGenerating}
                max={10}
                min={2}
                onChange={(event) =>
                  setRequest((current) => ({
                    ...current,
                    groupSize: Number(event.target.value),
                  }))
                }
                type="number"
                value={request.groupSize}
              />
            </label>
          </div>

          <div className="field">
            <span>여행 기간</span>
            <div className="readonly-pill">1박 2일</div>
          </div>

          <div className="field">
            <span>여행 스타일</span>
            <div className="chip-row" aria-label="선택된 여행 스타일">
              {request.styles.map((style, index) => (
                <span className="chip" key={style}>
                  {styleLabels[index] ?? style}
                </span>
              ))}
            </div>
          </div>

          <div className="member-box">
            <strong>멤버 선호 반영</strong>
            <p>
              기본 데모 데이터에는 사진, 맛집, 자연 선호가 포함되어 있어 단체 취향
              균형 흐름을 바로 보여줄 수 있습니다.
            </p>
          </div>

          {error ? (
            <p className="error-message" role="alert">
              {error}
            </p>
          ) : null}

          <button className="primary-button" disabled={isGenerating}>
            {isGenerating ? "AI가 일정을 생성 중..." : "AI 일정 생성"}
          </button>
        </form>

        <section className="preview-card" aria-live="polite">
          {trip ? (
            <>
              <TripResultView trip={trip} />
              <div className="share-card">
                <div>
                  <h3>결과 공유</h3>
                  <p>생성된 일정은 공유 URL로 다시 확인할 수 있습니다.</p>
                </div>
                <button
                  className="secondary-button"
                  disabled={!canShare}
                  onClick={handleShare}
                  type="button"
                >
                  공유하기
                </button>
                {share ? (
                  <a className="share-url" href={share.shareUrl}>
                    {share.shareUrl}
                  </a>
                ) : null}
              </div>
            </>
          ) : (
            <div className="empty-state">
              <p className="eyebrow">READY</p>
              <h2>조건을 확인하고 생성 버튼을 눌러주세요</h2>
              <p>
                결과 영역에는 일정표, 비용 요약, 좌표 기반 동선, 외부 링크가
                표시됩니다.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
