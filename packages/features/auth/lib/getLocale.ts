import { parse } from "accept-language-parser";
import { lookup } from "bcp-47-match";
import type { GetTokenParams } from "next-auth/jwt";
import { getToken } from "next-auth/jwt";

import { i18n } from "@calcom/i18n/next-i18next.config";

type ReadonlyHeaders = Awaited<ReturnType<typeof import("next/headers").headers>>;
type ReadonlyRequestCookies = Awaited<ReturnType<typeof import("next/headers").cookies>>;

/**
 * This is a slimmed down version of the `getServerSession` function from
 * `next-auth`.
 *
 * Instead of requiring the entire options object for NextAuth, we create
 * a compatible session using information from the incoming token.
 *
 * The downside to this is that we won't refresh sessions if the users
 * token has expired (30 days). This should be fine as we call `/auth/session`
 * frequently enough on the client-side to keep the session alive.
 */
export const getLocale = async (
  req:
    | GetTokenParams["req"]
    | {
        cookies: ReadonlyRequestCookies;
        headers: ReadonlyHeaders;
      }
): Promise<string> => {
  const token = await getToken({
    req: req as GetTokenParams["req"],
  });

  const tokenLocale = token?.["locale"];

  if (tokenLocale) {
    return tokenLocale;
  }

  // Check if user has explicitly set a locale cookie
  let cookieLocale: string | undefined;
  if ("cookies" in req && req.cookies) {
    if (typeof (req.cookies as any).get === "function") {
      cookieLocale = (req.cookies as any).get("NEXT_LOCALE")?.value || (req.cookies as any).get("locale")?.value;
    } else if (typeof req.cookies === "object") {
      cookieLocale = (req.cookies as Record<string, string>)["NEXT_LOCALE"] || (req.cookies as Record<string, string>)["locale"];
    }
  }

  if (cookieLocale && i18n.locales.includes(cookieLocale)) {
    return cookieLocale;
  }

  // Default to Turkish for all new and unauthenticated users
  return i18n.defaultLocale || "tr";
};
