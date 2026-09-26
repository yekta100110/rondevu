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

export interface ISmsProvider {
  readonly name: "twilio" | "netgsm" | "webhook" | "simulation";
  isConfigured(): boolean;
  send(payload: SMSPayload): Promise<SMSResponse>;
}
