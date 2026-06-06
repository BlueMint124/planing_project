"use client";

import { HelpCircle, Plane, Settings, Sparkles } from "lucide-react";

interface BrandHeaderProps {
  activeStep?: 1 | 2 | 3 | 4;
  modeLabel?: string;
}

const steps = [
  "기본 정보",
  "취향 선택",
  "AI 일정 생성",
  "결과 확인",
] as const;

export function BrandHeader({
  activeStep = 1,
  modeLabel = "LIVE",
}: BrandHeaderProps) {
  return (
    <header className="brand-header">
      <div className="brand-mark" aria-label="여행메이트">
        <span className="brand-icon">
          <Plane aria-hidden="true" size={24} />
        </span>
        <div>
          <strong>여행메이트</strong>
          <small>AI 그룹 여행 플래너</small>
        </div>
      </div>

      <nav className="stepper" aria-label="일정 생성 단계">
        {steps.map((step, index) => {
          const stepNumber = (index + 1) as 1 | 2 | 3 | 4;
          return (
            <div
              className={stepNumber === activeStep ? "step active" : "step"}
              key={step}
            >
              <span>{stepNumber}</span>
              <strong>{step}</strong>
            </div>
          );
        })}
      </nav>

      <div className="header-actions" aria-label="서비스 상태">
        <span className="mode-pill">
          <Sparkles aria-hidden="true" size={16} />
          {modeLabel}
        </span>
        <button className="icon-button" type="button" aria-label="도움말">
          <HelpCircle aria-hidden="true" size={20} />
        </button>
        <button className="icon-button" type="button" aria-label="설정">
          <Settings aria-hidden="true" size={20} />
        </button>
      </div>
    </header>
  );
}
