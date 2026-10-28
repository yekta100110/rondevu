import { WEBAPP_URL } from "@calcom/lib/constants";

export function isSameOriginRequest(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;

  try {
    return new URL(origin).origin === new URL(WEBAPP_URL).origin;
  } catch {
    return false;
  }
}
