"use client";

import { useState } from "react";
import {
  createHttpTripApiClient,
  type TripApiClient,
  type TripShareResponse,
} from "@/src/features/trips/api-client";
import {
  type TravelStyle,
  type TripGenerationRequest,
  type TripGenerationResponse,
  type TripState,
  tripDurationSchema,
  travelStyleSchema,
} from "@/src/features/trips/contracts";
import { mockJejuTripRequest } from "@/src/features/trips/mock-trip";
import { BrandHeader } from "./BrandHeader";
import { TripResultView } from "./TripResultView";

interface DemoPlannerProps {
  apiClient?: TripApiClient;
}

type WizardStep = 1 | 2 | 3 | 4;

const durationLabels = ["당일치기", "1박 2일", "2박 3일", "3박 4일"];
const durationOptions = tripDurationSchema.options.map((value, index) => ({
  value,
  label: durationLabels[index] ?? value,
}));

const styleLabels = [
  "맛집",
  "카페",
  "자연",
  "액티비티",
  "쇼핑",
  "역사/문화",
  "음악",
  "사진",
  "아이동반",
  "부모님동반",
];
const styleOptions = travelStyleSchema.options.map((value, index) => ({
  value,
  label: styleLabels[index] ?? value,
}));

function createDefaultRequest(): TripGenerationRequest {
  return {
    ...mockJejuTripRequest,
    destination: "제주",
  };
}

function parseTags(value: string) {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function formatTags(values: string[]) {
  return values.join(", ");
}

export function DemoPlanner({
  apiClient = createHttpTripApiClient(),
}: DemoPlannerProps) {
  const [request, setRequest] =
    useState<TripGenerationRequest>(createDefaultRequest);
  const [memberInputs, setMemberInputs] = useState(() =>
    createDefaultRequest().members.map((member) => ({
      likes: formatTags(member.likes),
      dislikes: formatTags(member.dislikes),
    })),
  );
  const [state, setState] = useState<TripState>("draft");
  const [uiStep, setUiStep] = useState<WizardStep>(1);
  const [trip, setTrip] = useState<TripGenerationResponse | null>(null);
  const [share, setShare] = useState<TripShareResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isGenerating = state === "generating";
  const canShare = Boolean(trip) && state !== "generating";

  async function runGeneration() {
    setUiStep(3);
    setState("generating");
    setError(null);
    setShare(null);

    try {
      const generationRequest: TripGenerationRequest = {
        ...request,
        members: request.members.map((member, index) => ({
          ...member,
          likes: parseTags(memberInputs[index]?.likes ?? ""),
          dislikes: parseTags(memberInputs[index]?.dislikes ?? ""),
        })),
      };
      const generated = await apiClient.generateTrip(generationRequest);
      setTrip(generated);
      setState("generated");
      setUiStep(4);
      requestAnimationFrame(() => {
        if (navigator.userAgent.includes("jsdom")) {
          return;
        }

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      });
    } catch {
      setTrip(null);
      setState("failed");
      setUiStep(3);
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

  function toggleStyle(style: TravelStyle) {
    setRequest((current) => {
      const isSelected = current.styles.includes(style);

      if (isSelected && current.styles.length === 1) {
        setError("여행 스타일은 최소 1개 이상 선택해야 합니다.");
        return current;
      }

      setError(null);
      return {
        ...current,
        styles: isSelected
          ? current.styles.filter((selected) => selected !== style)
          : [...current.styles, style],
      };
    });
  }

  function updateMember(
    index: number,
    member: Partial<TripGenerationRequest["members"][number]>,
  ) {
    setRequest((current) => ({
      ...current,
      members: current.members.map((currentMember, currentIndex) =>
        currentIndex === index ? { ...currentMember, ...member } : currentMember,
      ),
    }));
  }

  function addMember() {
    setRequest((current) => {
      if (current.members.length >= 10) {
        setError("멤버는 최대 10명까지 추가할 수 있습니다.");
        return current;
      }

      setError(null);
      setMemberInputs((currentInputs) => [
        ...currentInputs,
        {
          likes: "",
          dislikes: "",
        },
      ]);
      return {
        ...current,
        members: [
          ...current.members,
          {
            name: `멤버 ${current.members.length + 1}`,
            likes: [],
            dislikes: [],
          },
        ],
      };
    });
  }

  function removeMember(index: number) {
    setMemberInputs((current) =>
      current.filter((_, currentIndex) => currentIndex !== index),
    );
    setRequest((current) => ({
      ...current,
      members: current.members.filter((_, currentIndex) => currentIndex !== index),
    }));
  }

  function resetDraft() {
    const nextRequest = createDefaultRequest();
    setRequest(nextRequest);
    setMemberInputs(
      nextRequest.members.map((member) => ({
        likes: formatTags(member.likes),
        dislikes: formatTags(member.dislikes),
      })),
    );
    setTrip(null);
    setShare(null);
    setError(null);
    setState("draft");
    setUiStep(1);
  }

  function renderTripSummary() {
    return (
      <aside className="summary-panel">
        <div className="summary-panel-header">
          <h2>우리 여행 요약</h2>
          <span>실시간 반영</span>
        </div>
        <div className="summary-box-grid">
          <div>
            <span>여행지</span>
            <strong>{request.destination || "미정"}</strong>
          </div>
          <div>
            <span>여행 기간</span>
            <strong>{request.duration}</strong>
          </div>
          <div>
            <span>인원</span>
            <strong>{request.groupSize}명</strong>
          </div>
          <div>
            <span>1인당 예산</span>
            <strong>{request.budgetPerPerson.toLocaleString("ko-KR")}원</strong>
          </div>
        </div>
        <div className="selected-summary">
          <strong>선택 조건</strong>
          <div className="result-chip-row">
            <span className="result-chip muted">{request.destination || "미정"}</span>
            <span className="result-chip muted">{request.duration}</span>
            <span className="result-chip muted">{request.groupSize}명</span>
            <span className="result-chip muted">
              1인 {request.budgetPerPerson.toLocaleString("ko-KR")}원
            </span>
          </div>
        </div>
        <div className="route-map-visual compact-map" aria-hidden="true">
          <span className="map-label label-one">출발</span>
          <span className="map-label label-two">추천 경로</span>
          <span className="map-label label-three">도착</span>
          <svg viewBox="0 0 320 140" role="presentation">
            <path
              d="M24 96 C72 18 116 128 162 62 C206 0 226 120 296 38"
              fill="none"
              stroke="currentColor"
              strokeDasharray="8 8"
              strokeLinecap="round"
              strokeWidth="5"
            />
          </svg>
        </div>
      </aside>
    );
  }

  return (
    <main className="demo-shell">
      <BrandHeader activeStep={uiStep} modeLabel="DEMO MODE" />

      {uiStep === 1 ? (
        <div className="wizard-grid">
          <section className="wizard-card">
            <p className="step-badge">STEP 1 / 4</p>
            <div className="wizard-heading">
              <h1>어떤 여행을 계획하고 있나요?</h1>
              <p className="panel-copy">
                여행의 기본 정보를 입력하면 AI가 맞춤 일정을 만들어드려요.
              </p>
            </div>

            <label className="field">
              <span>어디로 여행을 떠나시나요?</span>
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

            <div className="field">
              <span>여행 기간은 얼마인가요?</span>
              <div className="option-grid compact-options">
                {durationOptions.map((option) => (
                  <label
                    className={
                      request.duration === option.value
                        ? "option-button selected"
                        : "option-button"
                    }
                    key={option.value}
                  >
                    <input
                      checked={request.duration === option.value}
                      disabled={isGenerating}
                      name="duration"
                      onChange={() =>
                        setRequest((current) => ({
                          ...current,
                          duration: option.value,
                        }))
                      }
                      type="radio"
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>

            <label className="field">
              <span>1인당 예산은 얼마인가요?</span>
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
              <span>함께 여행하는 인원은 몇 명인가요?</span>
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

            <div className="wizard-actions">
              <button className="secondary-outline-button" onClick={resetDraft} type="button">
                초기화
              </button>
              <button
                className="primary-button"
                onClick={() => setUiStep(2)}
                type="button"
              >
                다음: 취향 선택으로
              </button>
            </div>
          </section>
          {renderTripSummary()}
        </div>
      ) : null}

      {uiStep === 2 ? (
        <div className="wizard-grid">
          <section className="wizard-card">
            <p className="step-badge">STEP 2 / 4</p>
            <div className="wizard-heading">
              <h1>우리에게 딱 맞는 여행 취향을 알려주세요</h1>
              <p className="panel-copy">
                선택하신 취향을 바탕으로 더 만족스러운 일정을 만들어드릴게요.
              </p>
            </div>

            <div className="field">
              <span>여행 스타일 선택</span>
              <div className="style-card-grid" aria-label="여행 스타일">
                {styleOptions.map((option) => (
                  <label
                    className={
                      request.styles.includes(option.value)
                        ? "style-card selected"
                        : "style-card"
                    }
                    key={option.value}
                  >
                  <input
                    checked={request.styles.includes(option.value)}
                    disabled={isGenerating}
                    onChange={() => toggleStyle(option.value)}
                    type="checkbox"
                  />
                  {option.label}
                </label>
              ))}
              </div>
            </div>

            <div className="member-box">
              <div className="member-header">
                <div>
                  <strong>멤버별 선호도</strong>
                  <p>
                    함께하는 멤버의 선호도를 알려주시면 일정을 조율하는 데 참고할게요.
                  </p>
                </div>
                <button
                  className="ghost-button"
                  disabled={isGenerating || request.members.length >= 10}
                  onClick={addMember}
                  type="button"
                >
                  멤버 추가
                </button>
              </div>
              <div className="member-list horizontal-members">
                {request.members.map((member, index) => (
                  <article className="member-card" key={`member-${index}`}>
                    <div className="member-card-header">
                      <strong>{index + 1}번 멤버</strong>
                      {request.members.length > 1 ? (
                        <button
                          className="text-button"
                          disabled={isGenerating}
                          onClick={() => removeMember(index)}
                          type="button"
                        >
                          {index + 1}번 멤버 삭제
                        </button>
                      ) : null}
                    </div>
                    <label>
                      <span>이름</span>
                      <input
                        aria-label={`${index + 1}번 멤버 이름`}
                        disabled={isGenerating}
                        onChange={(event) =>
                          updateMember(index, { name: event.target.value })
                        }
                        value={member.name}
                      />
                    </label>
                    <label>
                      <span>선호</span>
                      <input
                        aria-label={`${index + 1}번 멤버 선호`}
                        disabled={isGenerating}
                        onChange={(event) =>
                          setMemberInputs((current) =>
                            current.map((input, currentIndex) =>
                              currentIndex === index
                                ? { ...input, likes: event.target.value }
                                : input,
                            ),
                          )
                        }
                        placeholder="카페, 사진"
                        value={memberInputs[index]?.likes ?? ""}
                      />
                    </label>
                    <label>
                      <span>비선호</span>
                      <input
                        aria-label={`${index + 1}번 멤버 비선호`}
                        disabled={isGenerating}
                        onChange={(event) =>
                          setMemberInputs((current) =>
                            current.map((input, currentIndex) =>
                              currentIndex === index
                                ? { ...input, dislikes: event.target.value }
                                : input,
                            ),
                          )
                        }
                        placeholder="등산"
                        value={memberInputs[index]?.dislikes ?? ""}
                      />
                    </label>
                  </article>
                ))}
              </div>
            </div>

            {error ? (
              <p className="error-message" role="alert">
                {error}
              </p>
            ) : null}

            <div className="wizard-actions">
              <button
                className="secondary-outline-button"
                onClick={() => setUiStep(1)}
                type="button"
              >
                이전 단계
              </button>
              <button
                className="primary-button"
                disabled={isGenerating}
                onClick={runGeneration}
                type="button"
              >
                AI 일정 생성
              </button>
            </div>
          </section>
          {renderTripSummary()}
        </div>
      ) : null}

      {uiStep === 3 ? (
        <div className="generation-grid">
          <section className="generation-card">
            <p className="step-badge">STEP 3 / 4</p>
            <div className="generation-illustration" aria-hidden="true" />
            <h1>
              {state === "failed"
                ? "일정을 생성하지 못했어요"
                : "동선과 예산을 계산 중이에요"}
            </h1>
            <p>
              {state === "failed"
                ? "일시적인 오류가 발생했어요. 네트워크 상태나 서비스 상황을 확인한 후 다시 시도해 주세요."
                : "최적의 여행 경로와 비용을 찾고 있어요. 잠시만 기다려 주세요."}
            </p>
            {state !== "failed" ? (
              <div className="generation-checklist">
                <span>장소 후보 찾기 · 완료</span>
                <span>이동 시간 계산 · 진행 중</span>
                <span>취향 균형 맞추기 · 대기 중</span>
                <span>예상 비용 확인 · 대기 중</span>
              </div>
            ) : null}
            {state === "failed" ? (
              <>
                <p className="error-message" role="alert">
                  {error}
                </p>
                <div className="wizard-actions centered-actions">
                  <button className="primary-button" onClick={runGeneration} type="button">
                    동일 조건으로 다시 시도
                  </button>
                  <button
                    className="secondary-outline-button"
                    onClick={() => setUiStep(2)}
                    type="button"
                  >
                    입력 조건 수정
                  </button>
                </div>
              </>
            ) : null}
          </section>
        </div>
      ) : null}

      {uiStep === 4 && trip ? (
        <div className="result-page">
          <p className="step-badge">STEP 4 / 4</p>
          <TripResultView trip={trip} />
          <div className="share-card">
            <div>
              <h3>결과 공유</h3>
              <p>생성된 일정은 공유 URL로 다시 확인할 수 있습니다.</p>
            </div>
            <button
              className="secondary-button"
              disabled={isGenerating}
              onClick={runGeneration}
              type="button"
            >
              현재 조건으로 재생성
            </button>
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
        </div>
      ) : null}
    </main>
  );
}
