import { createHash } from "node:crypto";
import process from "node:process";
import { checkRateLimitAndThrowError } from "@calcom/lib/checkRateLimitAndThrowError";
import { hashEmail } from "@calcom/lib/server/PiiHasher";
import { totpRawCheck } from "@calcom/lib/totp";

export const verifyCodeUnAuthenticated = async (email: string, code: string) => {
  if (!email || !code) {
    throw new Error("Email and code are required");
  }

  await checkRateLimitAndThrowError({
    rateLimitingType: "core",
    identifier: `emailVerifyCode.${hashEmail(email)}`,
  });

  const { default: isSmsCalEmail } = await import("@calcom/lib/isSmsCalEmail");
  if (isSmsCalEmail(email)) {
    const rawDigits = email.split("@")[0].replace(/\D/g, "");
    const { checkPhoneVerification } = await import("./phoneVerification");
    const result = await checkPhoneVerification(rawDigits, code);
    if (!result.success) {
      throw new Error(result.error || "Invalid verification code");
    }
    return true;
  }

  const secret = createHash("md5")
    .update(email + (process.env.CALENDSO_ENCRYPTION_KEY || ""))
    .digest("hex");

  const isValidToken = totpRawCheck(code, secret, { step: 900 });

  if (!isValidToken) {
    throw new Error("Invalid verification code");
  }

  return true;
};
