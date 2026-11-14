import { WEBAPP_URL } from "@calcom/lib/constants";
import { loadTranslations } from "@calcom/i18n/server";
import { EventTypeServiceSchema } from "@components/schemas/ProfileSchema";
import { buildLegacyCtx, decodeParams } from "@lib/buildLegacyCtx";
import { getServerSideProps } from "@server/lib/[user]/[type]/getServerSideProps";
import type { PageProps } from "app/_types";
import { generateMeetingMetadata } from "app/_utils";
import { CustomI18nProvider } from "app/CustomI18nProvider";
import { withAppDirSsr } from "app/WithAppDirSsr";
import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import type React from "react";
import type { PageProps as LegacyPageProps } from "~/users/views/users-type-public-view";
import LegacyPage from "~/users/views/users-type-public-view";

const getData: (ctx: ReturnType<typeof buildLegacyCtx>) => Promise<LegacyPageProps> =
  withAppDirSsr<LegacyPageProps>(getServerSideProps);

const isOutreachDemoMetadata = (metadata: unknown): boolean =>
  typeof metadata === "object" &&
  metadata !== null &&
  !Array.isArray(metadata) &&
  (metadata as Record<string, unknown>).isOutreachDemo === true;

const resolveEventTypeSeoFlags = (props: LegacyPageProps) => {
  const { isSEOIndexable = true, eventData } = props;
  const isOutreachDemo =
    isOutreachDemoMetadata(eventData?.owner?.metadata) ||
    Boolean(eventData?.subsetOfHosts?.some((host) => isOutreachDemoMetadata(host.user?.metadata)));
  const isHidden = Boolean(eventData?.hidden);
  const allowSEOIndexing = isSEOIndexable === true;
  const canIndex = allowSEOIndexing && !isOutreachDemo && !isHidden;
  return { isOutreachDemo, isHidden, allowSEOIndexing, canIndex };
};

const ServerPage = async ({ params, searchParams }: PageProps): Promise<JSX.Element> => {
  const legacyCtx = buildLegacyCtx(await headers(), await cookies(), await params, await searchParams);
  const props = await getData(legacyCtx);
  const { isOutreachDemo, isHidden, allowSEOIndexing, canIndex } = resolveEventTypeSeoFlags(props);
  const { eventData, user } = props;

  const serviceSchema =
    canIndex && eventData ? (
      <EventTypeServiceSchema
        allowSEOIndexing={allowSEOIndexing}
        isOutreachDemo={isOutreachDemo}
        isHidden={isHidden}
        username={user || eventData.profile?.username}
        providerName={eventData.profile?.name}
        providerImage={eventData.profile?.image}
        businessName={eventData.entity?.name}
        service={{
          id: eventData.id,
          title: eventData.title,
          slug: eventData.slug,
          length: eventData.length,
          price: eventData.price,
          currency: eventData.currency,
          description: eventData.description,
          descriptionAsSafeHTML:
            "descriptionAsSafeHTML" in eventData ? eventData.descriptionAsSafeHTML : undefined,
        }}
      />
    ) : null;

  const locale = props.eventData?.interfaceLanguage;
  if (locale) {
    const ns = "common";
    const translations = await loadTranslations(locale, ns);
    return (
      <>
        {serviceSchema}
        <CustomI18nProvider translations={translations} locale={locale} ns={ns}>
          <LegacyPage {...props} />
        </CustomI18nProvider>
      </>
    );
  }

  return (
    <>
      {serviceSchema}
      <LegacyPage {...props} />
    </>
  );
};

export const generateMetadata = async ({ params, searchParams }: PageProps): Promise<Metadata> => {
  const legacyCtx = buildLegacyCtx(await headers(), await cookies(), await params, await searchParams);
  const props = await getData(legacyCtx);

  const { booking, eventData, isBrandingHidden } = props;
  const { canIndex } = resolveEventTypeSeoFlags(props);
  const rescheduleUid = booking?.uid;
  const profileName = eventData?.profile?.name ?? "";
  const title = eventData?.title ?? "";
  const meeting = {
    title,
    profile: { name: profileName, image: eventData?.profile.image },
    users:
      eventData?.subsetOfUsers.map((user) => ({
        name: `${user.name}`,
        username: `${user.username}`,
      })) || [],
  };
  const decodedParams = decodeParams(await params);
  const metadata = await generateMeetingMetadata(
    meeting,
    (t) => `${rescheduleUid && !!booking ? t("reschedule") : ""} ${title} | ${profileName}`,
    (t) => `${rescheduleUid ? t("reschedule") : ""} ${title}`,
    isBrandingHidden,
    WEBAPP_URL,
    `/${decodedParams.user}/${decodedParams.type}`
  );

  return {
    ...metadata,
    robots: {
      follow: canIndex,
      index: canIndex,
    },
  };
};

export default ServerPage;
