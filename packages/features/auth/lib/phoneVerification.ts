import { createHash } from "node:crypto";
import process from "node:process";
import { normalizePhoneNumber, sendSMS } from "@calcom/lib/smsTransport";
import { totpRawCheck } from "@calcom/lib/totp";
import { totp } from "otplib";

export interface PhoneVerificationResult {
  success: boolean;
  error?: string;
}

export function isTwilioVerifyConfigured(): boolean {
  const accountSid = process.env.TWILIO_SID || process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_TOKEN || process.env.TWILIO_AUTH_TOKEN;
  const verifySid = process.env.TWILIO_VERIFY_SID;
  return Boolean(accountSid && authToken && verifySid);
}

/**
 * Dispatches an SMS verification OTP to the target phone number.
 * Uses Twilio Verify API (TWILIO_VERIFY_SID) if configured; otherwise falls back to TOTP via sendSMS.
 */
export async function sendPhoneVerification(phoneNumber: string): Promise<PhoneVerificationResult> {
  const normalizedPhone = normalizePhoneNumber(phoneNumber, "twilio");

  if (isTwilioVerifyConfigured()) {
    const accountSid = (process.env.TWILIO_SID || process.env.TWILIO_ACCOUNT_SID) as string;
    const authToken = (process.env.TWILIO_TOKEN || process.env.TWILIO_AUTH_TOKEN) as string;
    const verifySid = process.env.TWILIO_VERIFY_SID as string;

    const basicAuth = Buffer.from(`${accountSid}:${authToken}`).toString("base64");
    const params = new URLSearchParams();
    params.append("To", normalizedPhone);
    params.append("Channel", "sms");

    try {
      const res = await fetch(`https://verify.twilio.com/v2/Services/${verifySid}/Verifications`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${basicAuth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      });

      const data = await res.json();
      if (!res.ok) {
        return {
          success: false,
          error: data.message || `Twilio Verify HTTP Error ${res.status}`,
        };
      }

      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : String(err),
      };
    }
  }

  // Fallback: Generate local TOTP and dispatch via general SMS transport
  const secret = createHash("md5")
    .update(normalizedPhone + (process.env.CALENDSO_ENCRYPTION_KEY || ""))
    .digest("hex");

  totp.options = { step: 900 };
  const code = totp.generate(secret);

  try {
    const res = await sendSMS({
      to: normalizedPhone,
      body: `rOndevu randevu doğrulama kodunuz: ${code}`,
    });

    if (!res.success) {
      return { success: false, error: res.error || "SMS dispatch failed" };
    }
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

/**
 * Validates the entered OTP code against the target phone number.
 * Uses Twilio Verify API if configured; otherwise checks local TOTP.
 */
export async function checkPhoneVerification(
  phoneNumber: string,
  code: string
): Promise<PhoneVerificationResult> {
  const normalizedPhone = normalizePhoneNumber(phoneNumber, "twilio");

  if (isTwilioVerifyConfigured()) {
    const accountSid = (process.env.TWILIO_SID || process.env.TWILIO_ACCOUNT_SID) as string;
    const authToken = (process.env.TWILIO_TOKEN || process.env.TWILIO_AUTH_TOKEN) as string;
    const verifySid = process.env.TWILIO_VERIFY_SID as string;

    const basicAuth = Buffer.from(`${accountSid}:${authToken}`).toString("base64");
    const params = new URLSearchParams();
    params.append("To", normalizedPhone);
    params.append("Code", code.trim());

    try {
      const res = await fetch(`https://verify.twilio.com/v2/Services/${verifySid}/VerificationCheck`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${basicAuth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      });

      const data = await res.json();
      if (!res.ok) {
        return {
          success: false,
          error: data.message || "Twilio verification check failed",
        };
      }

      if (data.status === "approved" || data.valid === true) {
        return { success: true };
      }

      return {
        success: false,
        error: "Geçersiz doğrulama kodu.",
      };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : String(err),
      };
    }
  }

  // Fallback: Verify local TOTP
  const secret = createHash("md5")
    .update(normalizedPhone + (process.env.CALENDSO_ENCRYPTION_KEY || ""))
    .digest("hex");

  const isValidToken = totpRawCheck(code.trim(), secret, { step: 900 });

  if (!isValidToken) {
    return { success: false, error: "Invalid verification code" };
  }

  return { success: true };
}
