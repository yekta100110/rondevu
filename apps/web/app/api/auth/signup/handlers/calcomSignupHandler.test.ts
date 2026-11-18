import type { MockResponse } from "@rondevu/features/auth/signup/handlers/__tests__/mocks/next.mocks";
import {
  prismaMock,
  resetPrismaMock,
} from "@rondevu/features/auth/signup/handlers/__tests__/mocks/prisma.mocks";
import type { SignupBody } from "@rondevu/features/auth/signup/handlers/__tests__/mocks/signup.factories";
import {
  createMockFoundToken,
  createMockTeam,
} from "@rondevu/features/auth/signup/handlers/__tests__/mocks/signup.factories";
import type { Mock } from "vitest";
import { vi } from "vitest";

const mockFindTokenByToken: Mock = vi.fn();
const mockValidateAndGetCorrectedUsernameForTeam: Mock = vi.fn();

type UsernameStatus = {
  statusCode: 200 | 402 | 418;
  requestedUserName: string;
  json: { available: boolean; premium: boolean };
};

type InnerHandler = (body: Record<string, string>, status: UsernameStatus) => Promise<MockResponse>;

var mockCapturedHandler: InnerHandler | null;

vi.mock("next/server", async () => {
  const { createNextServerMock } = await import(
    "@rondevu/features/auth/signup/handlers/__tests__/mocks/next.mocks"
  );
  return createNextServerMock();
});
vi.mock("next/headers", async () => {
  const { createNextHeadersMock } = await import(
    "@rondevu/features/auth/signup/handlers/__tests__/mocks/next.mocks"
  );
  return createNextHeadersMock();
});
vi.mock("@rondevu/prisma", async () => {
  const { createPrismaMock } = await import(
    "@rondevu/features/auth/signup/handlers/__tests__/mocks/prisma.mocks"
  );
  return createPrismaMock();
});
vi.mock("@rondevu/prisma/client", async () => {
  const { createPrismaMock } = await import(
    "@rondevu/features/auth/signup/handlers/__tests__/mocks/prisma.mocks"
  );
  return createPrismaMock();
});
vi.mock("@rondevu/lib/logger", () => ({
  default: { getSubLogger: () => ({ warn: vi.fn(), error: vi.fn(), debug: vi.fn(), info: vi.fn() }) },
}));
vi.mock("@rondevu/lib/auth/hashPassword", () => ({ hashPassword: vi.fn().mockResolvedValue("hashed") }));
vi.mock("@rondevu/lib/constants", () => ({ WEBAPP_URL: "http://localhost:3000" }));
vi.mock("@rondevu/lib/tracking", () => ({ getTrackingFromCookies: vi.fn().mockReturnValue({}) }));
vi.mock("@rondevu/app-store/stripepayment/lib/utils", () => ({ getPremiumMonthlyPlanPriceId: vi.fn() }));
vi.mock("@rondevu/features/auth/lib/getLocaleFromRequest", () => ({
  getLocaleFromRequest: vi.fn().mockResolvedValue("en"),
}));
vi.mock("@rondevu/features/auth/lib/verifyEmail", () => ({ sendEmailVerification: vi.fn() }));
vi.mock("@rondevu/features/auth/signup/utils/createOrUpdateMemberships", () => ({
  createOrUpdateMemberships: vi.fn(),
}));
vi.mock("@rondevu/features/auth/signup/utils/prefillAvatar", () => ({ prefillAvatar: vi.fn() }));
vi.mock("@rondevu/features/auth/signup/utils/validateUsername", () => ({
  validateAndGetCorrectedUsernameAndEmail: vi.fn().mockResolvedValue({ isValid: true, username: "testuser" }),
}));
vi.mock("@rondevu/features/watchlist/lib/telemetry", () => ({ sentrySpan: {} }));
vi.mock("@rondevu/features/watchlist/operations/check-if-email-in-watchlist.controller", () => ({
  checkIfEmailIsBlockedInWatchlistController: vi.fn().mockResolvedValue(false),
}));
vi.mock("@rondevu/features/di/containers/FeatureRepository", () => ({
  getFeatureRepository: vi.fn().mockReturnValue({
    checkIfFeatureIsEnabledGlobally: vi.fn().mockResolvedValue(false),
  }),
}));
vi.mock("@rondevu/features/watchlist/lib/repository/GlobalWatchlistRepository", () => {
  return {
    GlobalWatchlistRepository: class {
      findBlockedEmail = vi.fn().mockResolvedValue(null);
      createEntry = vi.fn().mockResolvedValue({});
    },
  };
});
vi.mock("@rondevu/features/watchlist/lib/utils/normalization", () => ({
  normalizeEmail: vi.fn((e: string) => e.toLowerCase()),
}));
vi.mock("@rondevu/web/lib/buildLegacyCtx", () => ({ buildLegacyRequest: vi.fn() }));
vi.mock("@rondevu/features/auth/signup/utils/organization", () => ({ joinAnyChildTeamOnOrgInvite: vi.fn() }));
vi.mock("@rondevu/features/auth/signup/utils/token", () => ({
  findTokenByToken: (...args: unknown[]) => mockFindTokenByToken(...args),
  throwIfTokenExpired: vi.fn(),
  validateAndGetCorrectedUsernameForTeam: (...args: unknown[]) =>
    mockValidateAndGetCorrectedUsernameForTeam(...args),
}));

// Capture inner handler from usernameHandler wrapper
vi.mock("@rondevu/lib/server/username", () => ({
  usernameHandler: (handler: InnerHandler) => {
    mockCapturedHandler = handler;
    return handler;
  },
}));

// Import after mocks
import "./calcomSignupHandler";
import { runP2002TestSuite } from "@rondevu/features/auth/signup/handlers/__tests__/p2002.test-suite";

function callHandler(body: SignupBody): Promise<MockResponse> {
  if (!mockCapturedHandler) throw new Error("Handler not captured");
  return mockCapturedHandler(body as unknown as Record<string, string>, {
    statusCode: 200,
    requestedUserName: body.username || "testuser",
    json: { available: true, premium: false },
  });
}

runP2002TestSuite("calcomHandler", callHandler, () => {
  vi.clearAllMocks();
  resetPrismaMock();
  mockFindTokenByToken.mockResolvedValue(createMockFoundToken());
  mockValidateAndGetCorrectedUsernameForTeam.mockResolvedValue("testuser");
  prismaMock.team.findUnique.mockResolvedValue(createMockTeam() as never);
  prismaMock.verificationToken.delete.mockResolvedValue({} as never);
});
