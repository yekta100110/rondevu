import process from "node:process";
export interface SMSPayload {
  to: string;
  body: string;
}

export interface SMSResponse {
  success: boolean;
  provider: "twilio" | "netgsm" | "webhook" | "simulation";
  messageId?: string;
  error?: string;
}

export function getSMSConfig() {
  const twilioConfigured = Boolean(
    (process.env.TWILIO_SID || process.env.TWILIO_ACCOUNT_SID) &&
      (process.env.TWILIO_TOKEN || process.env.TWILIO_AUTH_TOKEN) &&
      (process.env.TWILIO_PHONE_NUMBER || process.env.TWILIO_MESSAGING_SID)
  );

  const netgsmConfigured = Boolean(
    process.env.NETGSM_USERCODE && process.env.NETGSM_PASSWORD && process.env.NETGSM_HEADER
  );

  const webhookConfigured = Boolean(process.env.SMS_WEBHOOK_URL);

  const explicitProvider = process.env.SMS_PROVIDER?.toLowerCase();

  let activeProvider: "twilio" | "netgsm" | "webhook" | "simulation" = "simulation";

  if (explicitProvider === "netgsm" && netgsmConfigured) {
    activeProvider = "netgsm";
  } else if (explicitProvider === "twilio" && twilioConfigured) {
    activeProvider = "twilio";
  } else if (explicitProvider === "webhook" && webhookConfigured) {
    activeProvider = "webhook";
  } else if (netgsmConfigured) {
    activeProvider = "netgsm";
  } else if (twilioConfigured) {
    activeProvider = "twilio";
  } else if (webhookConfigured) {
    activeProvider = "webhook";
  }

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
 * Normalizes phone numbers to standard format
 */
function normalizePhoneNumber(phone: string, target: "twilio" | "netgsm" | "general"): string {
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

export async function sendSMS({ to, body }: SMSPayload): Promise<SMSResponse> {
  const config = getSMSConfig();

  if (config.activeProvider === "twilio") {
    const accountSid = (process.env.TWILIO_SID || process.env.TWILIO_ACCOUNT_SID) as string;
    const authToken = (process.env.TWILIO_TOKEN || process.env.TWILIO_AUTH_TOKEN) as string;
    const fromPhone = process.env.TWILIO_PHONE_NUMBER;
    const messagingSid = process.env.TWILIO_MESSAGING_SID;

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

  if (config.activeProvider === "netgsm") {
    const usercode = process.env.NETGSM_USERCODE as string;
    const password = process.env.NETGSM_PASSWORD as string;
    const header = process.env.NETGSM_HEADER || "RONDEVU";

    const normalizedTo = normalizePhoneNumber(to, "netgsm");

    try {
      const url = new URL("https://api.netgsm.com.tr/sms/send/get/");
      url.searchParams.append("usercode", usercode);
      url.searchParams.append("password", password);
      url.searchParams.append("gsmno", normalizedTo);
      url.searchParams.append("message", body);
      url.searchParams.append("msgheader", header);
      url.searchParams.append("dil", "TR");

      const res = await fetch(url.toString(), {
        method: "GET",
      });

      const responseText = (await res.text()).trim();

      // Netgsm returns "00 <jobid>" or "01 <jobid>" or "02 <jobid>" on success
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

  if (config.activeProvider === "webhook") {
    const webhookUrl = process.env.SMS_WEBHOOK_URL as string;
    const token = process.env.SMS_WEBHOOK_TOKEN;

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

  // Simulation mode (Fallback when no active provider is configured in environment)
  console.info(`[rOndevu SMS Simülasyonu] Alıcı: ${to} | Mesaj: ${body}`);
  return {
    success: true,
    provider: "simulation",
    messageId: `sim-${Date.now()}`,
  };
}
