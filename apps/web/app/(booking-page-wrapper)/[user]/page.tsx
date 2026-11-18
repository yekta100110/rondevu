import { WEBAPP_URL } from "@rondevu/lib/constants";
import { prisma } from "@rondevu/prisma";
import { ProfileSchema } from "@components/schemas/ProfileSchema";
import { buildLegacyCtx, decodeParams } from "@lib/buildLegacyCtx";
import { getServerSideProps } from "@server/lib/[user]/getServerSideProps";
import type { PageProps } from "app/_types";
import { generateMeetingMetadata } from "app/_utils";
import { withAppDirSsr } from "app/WithAppDirSsr";
import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import type React from "react";
import type { PageProps as LegacyPageProps } from "~/users/views/users-public-view";
import LegacyPage from "~/users/views/users-public-view";

const getData: (ctx: ReturnType<typeof buildLegacyCtx>) => Promise<LegacyPageProps> =
  withAppDirSsr<LegacyPageProps>(getServerSideProps);

const isOutreachDemoMetadata = (metadata: unknown): boolean =>
  typeof metadata === "object" &&
  metadata !== null &&
  !Array.isArray(metadata) &&
  (metadata as Record<string, unknown>).isOutreachDemo === true;

const resolveUserSeoFlags = async (
  props: LegacyPageProps
): Promise<{ isOutreachDemo: boolean; allowSEOIndexing: boolean }> => {
  const { profile, isOrgSEOIndexable, users } = props;
  const isOrg = !!profile?.organization;

  let isOutreachDemo = false;
  if (!isOrg) {
    const firstUserUpId = users?.[0]?.profile?.upId;
    const parsedUserId =
      typeof firstUserUpId === "string" && /^usr-\d+$/.test(firstUserUpId)
        ? Number(firstUserUpId.slice(4))
        : null;

    const userRecord =
      parsedUserId !== null
        ? await prisma.user.findUnique({
            where: { id: parsedUserId },
            select: { metadata: true },
          })
        : profile.username
          ? await prisma.user.findFirst({
              where: { username: profile.username, profiles: { none: {} } },
              select: { metadata: true },
            })
          : null;

    isOutreachDemo = isOutreachDemoMetadata(userRecord?.metadata);
  }

  const allowSEOIndexing = Boolean(
    !isOutreachDemo &&
      ((!isOrg && profile.allowSEOIndexing) || (isOrg && isOrgSEOIndexable && profile.allowSEOIndexing))
  );

  return { isOutreachDemo, allowSEOIndexing };
};

const ServerPage = async ({ params, searchParams }: PageProps): Promise<JSX.Element> => {
  const props = await getData(
    buildLegacyCtx(await headers(), await cookies(), await params, await searchParams)
  );
  const { isOutreachDemo, allowSEOIndexing } = await resolveUserSeoFlags(props);
  const { profile, markdownStrippedBio, entity, eventTypes } = props;

  return (
    <>
      {allowSEOIndexing && !isOutreachDemo && (
        <ProfileSchema
          allowSEOIndexing={allowSEOIndexing}
          isOutreachDemo={isOutreachDemo}
          username={profile.username}
          name={profile.name}
          image={profile.image}
          description={markdownStrippedBio}
          businessName={entity?.name}
          eventTypes={eventTypes}
        />
      )}
      <LegacyPage {...props} />
    </>
  );
};

export const generateMetadata = async ({ params, searchParams }: PageProps): Promise<Metadata> => {
  const props = await getData(
    buildLegacyCtx(await headers(), await cookies(), await params, await searchParams)
  );

  const { profile, markdownStrippedBio } = props;
  const { allowSEOIndexing } = await resolveUserSeoFlags(props);

  const meeting = {
    title: markdownStrippedBio,
    profile: { name: `${profile.name}`, image: profile.image },
    users: [{ username: `${profile.username}`, name: `${profile.name}` }],
  };
  const metadata = await generateMeetingMetadata(
    meeting,
    () => profile.name,
    () => markdownStrippedBio,
    false,
    WEBAPP_URL,
    `/${decodeParams(await params).user}`
  );

  return {
    ...metadata,
    robots: {
      follow: allowSEOIndexing,
      index: allowSEOIndexing,
    },
  };
};

export default ServerPage;
