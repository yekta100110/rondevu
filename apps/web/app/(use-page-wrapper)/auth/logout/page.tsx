import type { PageProps } from "app/_types";
import { _generateMetadata } from "app/_utils";
import { cookies, headers } from "next/headers";

import { buildLegacyCtx } from "@lib/buildLegacyCtx";

import Logout from "~/auth/logout-view";

export const generateMetadata = async () => {
  const metadata = await _generateMetadata(
    (t) => t("logged_out"),
    (t) => t("youve_been_logged_out"),
    undefined,
    undefined,
    "/auth/logout"
  );
  return {
    ...metadata,
    robots: {
      index: false,
      follow: false,
    },
  };
};

const Page = async ({ params, searchParams }: PageProps) => {
  // cookie will be cleared in `/apps/web/proxy.ts`
  const h = await headers();
  const context = buildLegacyCtx(h, await cookies(), await params, await searchParams);

  return <Logout query={context.query} />;
};

export default Page;
