import {
  type TripGenerationError,
  type TripGenerationRequest,
  type TripGenerationResponse,
  tripGenerationRequestSchema,
  tripGenerationResponseSchema,
} from "./contracts";

type GenerationStatus = 200 | 400 | 500;

export type TripGenerationServiceResult =
  | { status: 200; body: TripGenerationResponse }
  | { status: 400 | 500; body: TripGenerationError };

export interface TripGenerationLogger {
  info(entry: Record<string, unknown>): void;
  error(entry: Record<string, unknown>): void;
}

export interface TripGenerationServiceDependencies {
  generate(request: TripGenerationRequest): Promise<unknown>;
  createRequestId(): string;
  now(): Date;
  logger: TripGenerationLogger;
}

function summarizeRequest(request: TripGenerationRequest) {
  return {
    destination: request.destination,
    duration: request.duration,
    budgetPerPerson: request.budgetPerPerson,
    groupSize: request.groupSize,
    styles: request.styles,
    memberCount: request.members.length,
  };
}

function errorResult(
  status: Exclude<GenerationStatus, 200>,
  errorCode: string,
  message: string,
  requestId: string,
): TripGenerationServiceResult {
  return {
    status,
    body: {
      errorCode,
      message,
      requestId,
    },
  };
}

export function createTripGenerationService(
  dependencies: TripGenerationServiceDependencies,
) {
  return {
    async generate(input: unknown): Promise<TripGenerationServiceResult> {
      const requestId = dependencies.createRequestId();
      const startedAt = dependencies.now();
      const parsedRequest = tripGenerationRequestSchema.safeParse(input);

      if (!parsedRequest.success) {
        dependencies.logger.error({
          event: "trip_generation_invalid_request",
          requestId,
          createdAt: startedAt.toISOString(),
          failureCode: "INVALID_REQUEST",
          validationIssues: parsedRequest.error.issues.map((issue) => ({
            path: issue.path.join("."),
            code: issue.code,
          })),
        });

        return errorResult(
          400,
          "INVALID_REQUEST",
          "입력값을 확인해주세요.",
          requestId,
        );
      }

      const requestSummary = summarizeRequest(parsedRequest.data);

      try {
        const generated = await dependencies.generate(parsedRequest.data);
        const response = tripGenerationResponseSchema.parse(generated);
        const responseTimeMs =
          dependencies.now().getTime() - startedAt.getTime();

        dependencies.logger.info({
          event: "trip_generation_succeeded",
          requestId,
          createdAt: startedAt.toISOString(),
          inputSummary: requestSummary,
          responseTimeMs,
        });

        return {
          status: 200,
          body: response,
        };
      } catch {
        const responseTimeMs =
          dependencies.now().getTime() - startedAt.getTime();

        dependencies.logger.error({
          event: "trip_generation_failed",
          requestId,
          createdAt: startedAt.toISOString(),
          inputSummary: requestSummary,
          responseTimeMs,
          failureCode: "GENERATION_FAILED",
        });

        return errorResult(
          500,
          "GENERATION_FAILED",
          "일정을 생성하지 못했습니다. 잠시 후 다시 시도해주세요.",
          requestId,
        );
      }
    },
  };
}
