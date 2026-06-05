"use client";

import { type FormEvent, useState } from "react";
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
import { TripResultView } from "./TripResultView";

interface DemoPlannerProps {
  apiClient?: TripApiClient;
}

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
  const [trip, setTrip] = useState<TripGenerationResponse | null>(null);
  const [share, setShare] = useState<TripShareResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isGenerating = state === "generating";
  const canShare = Boolean(trip) && state !== "generating";

  async function runGeneration() {
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
    } catch {
      setTrip(null);
      setState("failed");
      setError("일정을 생성하지 못했어요. 조건을 확인한 뒤 다시 시도해주세요.");
    }
  }

  async function handleGenerate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await runGeneration();
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
      setMemberInputs((current) => [
        ...current,
        {
          likes: "",
          dislikes: "",
        },
      ]);
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
                지역, 예산, 인원, 취향을 바꾸면 같은 계약으로 API에 요청합니다.
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

          <div className="field">
            <span>여행 스타일</span>
            <div className="option-grid style-options" aria-label="여행 스타일">
              {styleOptions.map((option) => (
                <label
                  className={
                    request.styles.includes(option.value)
                      ? "option-button selected"
                      : "option-button"
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
                <strong>멤버 선호 반영</strong>
                <p>
                  쉼표로 구분해 선호와 비선호를 입력하면 생성 요청에 함께
                  전달됩니다.
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
            <div className="member-list">
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

          {state === "failed" ? (
            <button
              className="secondary-button full-width"
              disabled={isGenerating}
              onClick={runGeneration}
              type="button"
            >
              다시 시도
            </button>
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
