import { getSMSConfig } from "@rondevu/lib/smsTransport";
import type { TrpcSessionUser } from "../../../types";

type GetSMSConfigOptions = {
  ctx: {
    user: TrpcSessionUser;
  };
};

export default async function getSMSConfigHandler(_opts: GetSMSConfigOptions) {
  return getSMSConfig();
}
