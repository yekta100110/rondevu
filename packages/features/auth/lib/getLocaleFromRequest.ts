import parser from "accept-language-parser";
import type { GetServerSidePropsContext, NextApiRequest } from "next";

import { getServerSession } from "@calcom/features/auth/lib/getServerSession";

type Maybe<T> = T | null | undefined;

const { i18n } = require("@calcom/i18n/next-i18next.config");

export async function getLocaleFromRequest(
  req: NextApiRequest | GetServerSidePropsContext["req"]
): Promise<string> {
  const session = await getServerSession({ req });
  if (session?.user?.locale) return session.user.locale;

  // Check if explicit locale is set in cookies
  const cookieLocale = req.cookies?.["NEXT_LOCALE"] || req.cookies?.["locale"];
  if (cookieLocale && i18n.locales.includes(cookieLocale)) {
    return cookieLocale;
  }

  return i18n.defaultLocale || "tr";
}
