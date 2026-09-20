import { sendSMS } from "@calcom/lib/smsTransport";
import type { TrpcSessionUser } from "../../../types";
import type { TSendTestSMSSchema } from "./sendTestSMS.schema";

type SendTestSMSOptions = {
  ctx: {
    user: TrpcSessionUser;
  };
  input: TSendTestSMSSchema;
};

export default async function sendTestSMSHandler({ input }: SendTestSMSOptions) {
  const defaultBody = "rOndevu SMS Test Bildirimi: SMS altyapınız başarıyla çalışmaktadır.";
  const body = input.message?.trim() || defaultBody;

  const result = await sendSMS({
    to: input.phoneNumber,
    body,
  });

  return result;
}
