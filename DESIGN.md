# 여행메이트 UI Design System

이 문서는 AI 단체 여행 일정 생성기 웹 UI의 소스 오브 트루스다.
프론트엔드 기능을 구현하거나 수정할 때는 관련 계약 문서와 함께 이 문서를 먼저 읽는다.

## Design Direction

- 제품 인상: 깔끔하고 신뢰감 있는 스마트 여행 플래너
- 주요 화면: 데스크톱 웹 중심
- 기본 레이아웃: 입력 또는 일정 콘텐츠와 실시간 요약을 나란히 보여주는 Smart Dashboard
- 우선순위: 정보 이해, 발표 시연 가독성, 오류 복구, 여행의 설렘
- 모바일 대응: 핵심 기능이 깨지지 않는 반응형 레이아웃을 제공하되 데스크톱 경험을
  기준으로 설계한다.

## Visual References

- 입력 화면: `docs/ui-design/assets/desktop-trip-input.png`
- 취향 선택 화면: `docs/ui-design/assets/desktop-preferences.png`
- 생성 중 및 실패 상태: `docs/ui-design/assets/desktop-generation-states.png`
- 결과 화면: `docs/ui-design/assets/desktop-trip-results.png`

참조 이미지는 시각적 방향을 설명한다. 텍스트, 필드, 상태, 접근성 요구사항은
`docs/ui-design/screens.md`를 우선한다.

## Layout

- 최대 콘텐츠 너비: `1440px`
- 페이지 좌우 여백: 데스크톱 `48px`, 태블릿 `24px`, 모바일 `16px`
- 상단 헤더 높이: `64px`
- 입력 화면 메인 그리드: 왼쪽 콘텐츠 `minmax(0, 1.2fr)`, 오른쪽 요약 `minmax(360px, 0.8fr)`
- 결과 화면 메인 그리드: 왼쪽 일정 `minmax(0, 1.4fr)`, 오른쪽 지도 및 비용 `minmax(400px, 0.9fr)`
- 컬럼 간격: `32px`
- 오른쪽 요약 패널은 데스크톱에서 sticky, 모바일에서는 콘텐츠 아래로 이동한다.
- `1024px` 미만에서는 단일 컬럼으로 전환한다.

## Color Tokens

| 역할 | 토큰 | 값 |
| --- | --- | --- |
| 페이지 배경 | `--background` | `#F6F8FA` |
| 카드 배경 | `--card` | `#FFFFFF` |
| 기본 텍스트 | `--foreground` | `#102A43` |
| 보조 텍스트 | `--muted-foreground` | `#627D98` |
| 기본 액션 | `--primary` | `#0F9F8F` |
| 기본 액션 hover | `--primary-hover` | `#0B8276` |
| 선택 배경 | `--primary-soft` | `#E6F7F4` |
| 보조 강조 | `--accent` | `#3B82F6` |
| 경계선 | `--border` | `#D9E2EC` |
| 성공 | `--success` | `#168A5B` |
| 경고 | `--warning` | `#B7791F` |
| 오류 | `--destructive` | `#D64545` |

색상만으로 상태를 전달하지 않는다. 아이콘, 텍스트, 레이블을 함께 사용한다.

## Typography

- 기본 글꼴: `Pretendard`, `Inter`, `system-ui`, `sans-serif`
- 페이지 제목: `32px / 1.25`, `700`
- 섹션 제목: `24px / 1.35`, `700`
- 카드 제목: `18px / 1.4`, `600`
- 본문: `16px / 1.6`, `400`
- 보조 텍스트: `14px / 1.5`, `400`
- 레이블: `14px / 1.4`, `600`
- 숫자 비용 요약은 tabular numbers를 사용한다.

## Spacing And Shape

- 기본 간격 단위: `4px`
- 주요 간격: `8`, `12`, `16`, `24`, `32`, `48`
- 카드 내부 여백: `24px`
- 카드 모서리: `16px`
- 입력 필드와 버튼 모서리: `10px`
- 칩 모서리: `999px`
- 카드 그림자: 매우 약한 그림자만 사용하고 경계선으로 구조를 구분한다.

## Core Components

- `AppHeader`: 로고, 진행 단계, 데모 모드 배지, 결과 화면 액션
- `StepProgress`: 기본 정보, 취향 선택, 일정 생성, 결과 확인 상태
- `FormSectionCard`: 관련 입력을 묶는 카드
- `SummaryPanel`: 입력 조건, 선택 취향, 지도 미리보기 또는 비용 요약
- `ChoiceChip`: 기간, 여행 스타일, 선호 및 비선호 선택
- `MemberPreferenceCard`: 멤버별 이름, 선호, 비선호 입력
- `GenerationStatePanel`: 생성 중, 생성 실패, 재시도 상태
- `CostSummaryCard`: 총 예상 비용, 1인당 비용, 예산 상태
- `DayTabs`: 일자별 일정 전환
- `RouteTimeline`: 방문 순서와 이동 시간을 연결해 표시
- `PlaceCard`: 시간, 장소, 카테고리, 비용, 예약 링크
- `MapPanel`: 지도, 방문 순서 마커, 경로
- `Disclaimer`: 실제 가격과 예약 가능 여부 확인 안내

## Interaction Rules

- 기본 액션은 화면마다 하나만 강하게 강조한다.
- 입력 화면의 오른쪽 요약은 입력값 변경 즉시 갱신한다.
- 필드 오류는 해당 필드 아래에 인라인 메시지로 표시한다.
- 생성 중에는 입력을 수정할 수 없고 진행 단계를 보여준다.
- 생성 실패에는 동일 조건 재시도와 입력 수정 두 경로를 제공한다.
- 외부 예약 링크는 새 탭으로 열고 외부 링크임을 알 수 있게 표시한다.
- 공유 성공은 토스트와 복사 완료 텍스트로 피드백한다.

## Accessibility

- 키보드만으로 모든 입력, 칩, 탭, 버튼을 사용할 수 있어야 한다.
- 포커스 링을 제거하지 않는다.
- 폼 필드는 레이블과 오류 메시지를 프로그램적으로 연결한다.
- 선택 칩은 선택 상태를 `aria-pressed` 또는 적절한 폼 의미로 전달한다.
- 로딩 상태는 `aria-live`로 진행 메시지를 알린다.
- 텍스트 대비는 WCAG AA를 목표로 한다.

## Responsive Rules

- `>= 1280px`: 데스크톱 Smart Dashboard 전체 레이아웃
- `1024px ~ 1279px`: 오른쪽 패널 너비를 줄이고 카드 간격을 축소
- `< 1024px`: 단일 컬럼, 요약 패널은 폼 또는 일정 아래 배치
- `< 640px`: 헤더 진행 단계를 축약하고 버튼은 전체 너비로 표시
- 모바일에서도 기능을 제거하지 않는다.
