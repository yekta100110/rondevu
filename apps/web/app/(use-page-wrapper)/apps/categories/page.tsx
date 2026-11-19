import { getServerSideProps } from "@lib/apps/categories/getServerSideProps";
import { requirePaidAccess } from "@lib/billing/requirePaidAccess";
import { buildLegacyCtx } from "@lib/buildLegacyCtx";
import type { PageProps } from "app/_types";
import { withAppDirSsr } from "app/WithAppDirSsr";
import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import Page from "~/apps/categories/categories-view";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

const getData = withAppDirSsr(getServerSideProps);

async function ServerPage({ params, searchParams }: PageProps) {
  await requirePaidAccess();
  const props = await getData(
    buildLegacyCtx(await headers(), await cookies(), await params, await searchParams)
  );

  return <Page {...props} />;
}

export default ServerPage;
