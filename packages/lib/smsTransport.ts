import process from "node:process";
import type { ISmsProvider, SMSPayload, SMSResponse } from "./sms/types";

export * from "./sms/types";

/**
 * Normalizes phone numbers to standard format according to target provider
 */
export function normalizePhoneNumber(
  phone: string,
  target: "twilio" | "netgsm" | "general" = "general"
): string {
  const digits = phone.replace(/\D/g, "");
  if (target === "twilio") {
    if (digits.startsWith("90") && digits.length === 12) return `+${digits}`;
    if (digits.startsWith("0") && digits.length === 11) return `+9${digits}`;
    if (digits.length === 10) return `+90${digits}`;
    return `+${digits}`;
  }
  if (target === "netgsm") {
    // Netgsm expects 10 digits without leading 0 (e.g., 5521191987) or 12 digits (905521191987)
    if (digits.startsWith("90") && digits.length === 12) return digits.substring(2);
    if (digits.startsWith("0") && digits.length === 11) return digits.substring(1);
    return digits;
  }
  return digits.length > 0 ? `+${digits}` : phone.trim();
}

/**
 * Twilio Programmable Messaging Provider
 */
export class TwilioSmsProvider implements ISmsProvider {
  readonly name = "twilio" as const;

  isConfigured(): boolean {
    const accountSid = process.env.TWILIO_SID || process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_TOKEN || process.env.TWILIO_AUTH_TOKEN;
    const fromPhone = process.env.TWILIO_PHONE_NUMBER;
    const messagingSid = process.env.TWILIO_MESSAGING_SID;
    return Boolean(accountSid && authToken && (fromPhone || messagingSid));
  }

  async send({ to, body }: SMSPayload): Promise<SMSResponse> {
    const accountSid = (process.env.TWILIO_SID || process.env.TWILIO_ACCOUNT_SID) as string;
    const authToken = (process.env.TWILIO_TOKEN || process.env.TWILIO_AUTH_TOKEN) as string;
    const fromPhone = process.env.TWILIO_PHONE_NUMBER;
    const messagingSid = process.env.TWILIO_MESSAGING_SID;

    if (!accountSid || !authToken || (!fromPhone && !messagingSid)) {
      return {
        success: false,
        provider: "twilio",
        error: "Twilio credentials or sender configuration missing.",
      };
    }

    const normalizedTo = normalizePhoneNumber(to, "twilio");
    const basicAuth = Buffer.from(`${accountSid}:${authToken}`).toString("base64");

    const params = new URLSearchParams();
    params.append("To", normalizedTo);
    params.append("Body", body);

    if (messagingSid) {
      params.append("MessagingServiceSid", messagingSid);
    } else if (fromPhone) {
      params.append("From", fromPhone);
    }

    try {
      const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
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
          provider: "twilio",
          error: data.message || `Twilio HTTP Error ${res.status}`,
        };
      }

      return {
        success: true,
        provider: "twilio",
        messageId: data.sid,
      };
    } catch (err) {
      return {
        success: false,
        provider: "twilio",
        error: err instanceof Error ? err.message : String(err),
      };
    }
  }
}

/**
 * Netgsm Provider
 */
export class NetgsmSmsProvider implements ISmsProvider {
  readonly name = "netgsm" as const;

  isConfigured(): boolean {
    return Boolean(process.env.NETGSM_USERCODE && process.env.NETGSM_PASSWORD && process.env.NETGSM_HEADER);
  }

  async send({ to, body }: SMSPayload): Promise<SMSResponse> {
    const usercode = process.env.NETGSM_USERCODE as string;
    const password = process.env.NETGSM_PASSWORD as string;
    const header = process.env.NETGSM_HEADER || "RONDEVU";

    if (!usercode || !password) {
      return {
        success: false,
        provider: "netgsm",
        error: "Netgsm credentials missing.",
      };
    }

    const normalizedTo = normalizePhoneNumber(to, "netgsm");

    try {
      const url = new URL("https://api.netgsm.com.tr/sms/send/get/");
      url.searchParams.append("usercode", usercode);
      url.searchParams.append("password", password);
      url.searchParams.append("gsmno", normalizedTo);
      url.searchParams.append("message", body);
      url.searchParams.append("msgheader", header);
      url.searchParams.append("dil", "TR");

      const res = await fetch(url.toString(), { method: "GET" });
      const responseText = (await res.text()).trim();

      if (responseText.startsWith("00") || responseText.startsWith("01") || responseText.startsWith("02")) {
        const parts = responseText.split(" ");
        return {
          success: true,
          provider: "netgsm",
          messageId: parts[1] || responseText,
        };
      }

      const errorMap: Record<string, string> = {
        "20": "Mesaj metni çok uzun veya Türkçe karakter kodlaması hatası.",
        "30": "Geçersiz kullanıcı adı veya şifre (Netgsm).",
        "40": "Mesaj başlığı (Originator) sistemde tanımlı değil veya onaylanmamış.",
        "50": "Abone hesabında SMS gönderim kredisi yetersiz.",
        "51": "Abonelik hesabı pasif veya kapalı.",
        "70": "Hatalı parametre veya eksik telefon numarası.",
        "80": "Gönderim sınır aşımı veya hız limiti.",
      };

      return {
        success: false,
        provider: "netgsm",
        error: errorMap[responseText] || `Netgsm Hata Kodu: ${responseText}`,
      };
    } catch (err) {
      return {
        success: false,
        provider: "netgsm",
        error: err instanceof Error ? err.message : String(err),
      };
    }
  }
}

/**
 * Custom Webhook Provider
 */
export class WebhookSmsProvider implements ISmsProvider {
  readonly name = "webhook" as const;

  isConfigured(): boolean {
    return Boolean(process.env.SMS_WEBHOOK_URL);
  }

  async send({ to, body }: SMSPayload): Promise<SMSResponse> {
    const webhookUrl = process.env.SMS_WEBHOOK_URL as string;
    const token = process.env.SMS_WEBHOOK_TOKEN;

    if (!webhookUrl) {
      return {
        success: false,
        provider: "webhook",
        error: "SMS_WEBHOOK_URL is not defined.",
      };
    }

    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          to,
          body,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!res.ok) {
        return {
          success: false,
          provider: "webhook",
          error: `Webhook HTTP ${res.status}: ${await res.text()}`,
        };
      }

      return {
        success: true,
        provider: "webhook",
        messageId: `webhook-${Date.now()}`,
      };
    } catch (err) {
      return {
        success: false,
        provider: "webhook",
        error: err instanceof Error ? err.message : String(err),
      };
    }
  }
}

/**
 * Simulation Provider (Fallback for local dev or unconfigured environments)
 */
export class SimulationSmsProvider implements ISmsProvider {
  readonly name = "simulation" as const;

  isConfigured(): boolean {
    return true;
  }

  async send({ to, body }: SMSPayload): Promise<SMSResponse> {
    console.info(`[rOndevu SMS Simülasyonu] Alıcı: ${to} | Mesaj: ${body}`);
    return {
      success: true,
      provider: "simulation",
      messageId: `sim-${Date.now()}`,
    };
  }
}

/**
 * SMS Provider Factory
 */
export class SmsProviderFactory {
  private static twilioProvider = new TwilioSmsProvider();
  private static netgsmProvider = new NetgsmSmsProvider();
  private static webhookProvider = new WebhookSmsProvider();
  private static simulationProvider = new SimulationSmsProvider();

  static getActiveProvider(): ISmsProvider {
    const explicitProvider = process.env.SMS_PROVIDER?.toLowerCase();

    if (explicitProvider === "netgsm" && SmsProviderFactory.netgsmProvider.isConfigured()) {
      return SmsProviderFactory.netgsmProvider;
    }
    if (explicitProvider === "twilio" && SmsProviderFactory.twilioProvider.isConfigured()) {
      return SmsProviderFactory.twilioProvider;
    }
    if (explicitProvider === "webhook" && SmsProviderFactory.webhookProvider.isConfigured()) {
      return SmsProviderFactory.webhookProvider;
    }

    // Auto-detect priority
    if (SmsProviderFactory.twilioProvider.isConfigured()) {
      return SmsProviderFactory.twilioProvider;
    }
    if (SmsProviderFactory.netgsmProvider.isConfigured()) {
      return SmsProviderFactory.netgsmProvider;
    }
    if (SmsProviderFactory.webhookProvider.isConfigured()) {
      return SmsProviderFactory.webhookProvider;
    }

    return SmsProviderFactory.simulationProvider;
  }
}

export function getSMSConfig() {
  const twilioProvider = new TwilioSmsProvider();
  const netgsmProvider = new NetgsmSmsProvider();
  const webhookProvider = new WebhookSmsProvider();

  const twilioConfigured = twilioProvider.isConfigured();
  const netgsmConfigured = netgsmProvider.isConfigured();
  const webhookConfigured = webhookProvider.isConfigured();

  const activeProvider = SmsProviderFactory.getActiveProvider().name;

  const enabled =
    process.env.NEXT_PUBLIC_SMS_ENABLED === "true" ||
    process.env.SMS_ENABLED === "true" ||
    activeProvider !== "simulation";

  return {
    enabled,
    activeProvider,
    isConfigured: twilioConfigured || netgsmConfigured || webhookConfigured,
    providerDetails: {
      twilio: {
        configured: twilioConfigured,
        phoneNumber: process.env.TWILIO_PHONE_NUMBER
          ? process.env.TWILIO_PHONE_NUMBER.replace(/.(?=.{4})/g, "*")
          : undefined,
        messagingSid: process.env.TWILIO_MESSAGING_SID
          ? `${process.env.TWILIO_MESSAGING_SID.substring(0, 6)}...`
          : undefined,
        verifySid: process.env.TWILIO_VERIFY_SID
          ? `${process.env.TWILIO_VERIFY_SID.substring(0, 6)}...`
          : undefined,
      },
      netgsm: {
        configured: netgsmConfigured,
        usercode: process.env.NETGSM_USERCODE
          ? process.env.NETGSM_USERCODE.replace(/.(?=.{3})/g, "*")
          : undefined,
        header: process.env.NETGSM_HEADER,
      },
      webhook: {
        configured: webhookConfigured,
        url: process.env.SMS_WEBHOOK_URL ? "Mevcut / Yapılandırıldı" : undefined,
      },
    },
    mode: twilioConfigured || netgsmConfigured || webhookConfigured ? "production" : "simulation",
  };
}

/**
 * Universal SMS send entry point
 */
export async function sendSMS(payload: SMSPayload): Promise<SMSResponse> {
  const provider = SmsProviderFactory.getActiveProvider();
  return provider.send(payload);
}
