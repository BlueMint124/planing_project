# Shared Contracts

이 디렉터리는 프론트엔드, 백엔드, 외부 연동 기능이 함께 사용하는 계약의
소스 오브 트루스다.

## Contract Types

- API 요청과 응답 스키마
- 공통 데이터 타입과 필드 의미
- 상태 값과 허용 전이
- 오류 코드와 사용자 메시지 정책
- 환경 변수 이름과 용도
- 외부 서비스 어댑터 인터페이스

## Change Rules

1. 계약 변경은 구현 코드보다 먼저 또는 같은 커밋에서 문서화한다.
2. 기존 소비자에게 영향을 주는 변경은 작업 보드와 Pull Request에 명시한다.
3. 필드 이름, 타입, 필수 여부를 모호하게 기록하지 않는다.
4. 가능한 경우 요청, 성공 응답, 실패 응답 예시를 포함한다.
5. 계약 변경 후 프론트엔드 타입, 서버 검증, 테스트를 함께 갱신한다.

## Planned Contracts

- `trip-generation-api.md`: `POST /api/trips/generate` 요청, 응답, 오류 계약
- `trip-state-model.md`: 여행 생성 상태와 허용 전이
- `place-provider-adapter.md`: 장소 데이터 제공자 어댑터 계약

