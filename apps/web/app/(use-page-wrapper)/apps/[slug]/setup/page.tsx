import { requirePaidAccess } from "@lib/billing/requirePaidAccess";
import { buildLegacyCtx } from "@lib/buildLegacyCtx";
import { getServerSideProps } from "@rondevu/app-store/_pages/setup/_getServerSideProps";
import type { PageProps as ServerPageProps } from "app/_types";
import { _generateMetadata } from "app/_utils";
import { withAppDirSsr } from "app/WithAppDirSsr";
import { cookies, headers } from "next/headers";
import SetupView, { type PageProps as ClientPageProps } from "~/apps/[slug]/setup/setup-view";

export const generateMetadata = async ({ params: _params }: ServerPageProps) => {
  const params = await _params;
  const metadata = await _generateMetadata(
    () => `${params.slug}`,
    () => "",
    undefined,
    undefined,
    `/apps/${params.slug}/setup`
  );
  return {
    ...metadata,
    robots: {
      index: false,
      follow: false,
    },
  };
};

const getData = withAppDirSsr<ClientPageProps>(getServerSideProps);

const ServerPage = async ({ params, searchParams }: ServerPageProps) => {
  await requirePaidAccess();
  const context = buildLegacyCtx(await headers(), await cookies(), await params, await searchParams);

  const props = await getData(context);
  return <SetupView {...props} />;
};

export default ServerPage;
