import { getOAuthService } from "@rondevu/features/oauth/di/OAuthService.container";
import { OAuthErrorReason, OAUTH_ERROR_REASONS } from "@rondevu/features/oauth/services/OAuthService";
import { ErrorWithCode } from "@rondevu/lib/errors";
import { getHttpStatusCode } from "@rondevu/lib/server/getServerErrorFromUnknown";
import type { AccessScope } from "@rondevu/prisma/enums";
import { httpStatusToTrpcCode } from "@rondevu/trpc/server/lib/toTRPCError";
import type { TrpcSessionUser } from "@rondevu/trpc/server/types";

import { TRPCError } from "@trpc/server";

import type { TGenerateAuthCodeInputSchema } from "./generateAuthCode.schema";

type AddClientOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
  input: TGenerateAuthCodeInputSchema;
};

export const generateAuthCodeHandler = async ({ ctx, input }: AddClientOptions) => {
  try {
    const { clientId, scopes, teamSlug, codeChallenge, codeChallengeMethod, state, redirectUri } = input;
    const oAuthService = getOAuthService();

    const oAuthClientRedirectUri = redirectUri;
    const { authorizationCode, client, redirectUrl } = await oAuthService.generateAuthorizationCode(
      clientId,
      ctx.user.id,
      oAuthClientRedirectUri,
      scopes as AccessScope[],
      state,
      teamSlug,
      codeChallenge,
      codeChallengeMethod
    );
    return { client, authorizationCode: authorizationCode, redirectUrl: redirectUrl };
  } catch (error) {
    if (error instanceof ErrorWithCode) {
      throw new TRPCError({
        code: httpStatusToTrpcCode(getHttpStatusCode(error)),
        message: OAUTH_ERROR_REASONS[error?.data?.reason as OAuthErrorReason] ?? error.message,
        cause: error,
      });
    }

    throw error;
  }
};
