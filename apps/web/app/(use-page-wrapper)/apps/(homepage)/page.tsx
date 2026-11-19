import { requirePaidAccess } from "@lib/billing/requirePaidAccess";
import { buildLegacyRequest } from "@lib/buildLegacyCtx";
import { getAppRegistry, getAppRegistryWithCredentials } from "@rondevu/app-store/_appRegistry";
import { getServerSession } from "@rondevu/features/auth/lib/getServerSession";
import { UserRepository } from "@rondevu/features/users/repositories/UserRepository";
import prisma from "@rondevu/prisma";
import type { AppCategories } from "@rondevu/prisma/enums";
import { _generateMetadata } from "app/_utils";
import { cookies, headers } from "next/headers";
import AppsPage from "~/apps/apps-view";

export const generateMetadata = async () => {
  const metadata = await _generateMetadata(
    (t) => t("app_store"),
    (t) => t("app_store_description"),
    undefined,
    undefined,
    "/apps"
  );
  return {
    ...metadata,
    robots: {
      index: false,
      follow: false,
    },
  };
};

const ServerPage = async () => {
  await requirePaidAccess();
  const req = buildLegacyRequest(await headers(), await cookies());
  const session = await getServerSession({ req });
  let appStore, userAdminTeamsIds: number[];
  if (session?.user?.id) {
    const userRepo = new UserRepository(prisma);
    const userAdminTeams = await userRepo.getUserAdminTeams({ userId: session.user.id });
    userAdminTeamsIds = userAdminTeams?.teams?.map(({ team }) => team.id) ?? [];
    appStore = await getAppRegistryWithCredentials(session.user.id, userAdminTeamsIds);
  } else {
    appStore = await getAppRegistry();
    userAdminTeamsIds = [];
  }

  const categoryQuery = appStore.map(({ categories }) => ({
    categories: categories || [],
  }));
  const categories = categoryQuery.reduce(
    (c, app) => {
      for (const category of app.categories) {
        c[category] = c[category] ? c[category] + 1 : 1;
      }
      return c;
    },
    {} as Record<string, number>
  );

  const props = {
    categories: Object.entries(categories)
      .map(([name, count]): { name: AppCategories; count: number } => ({
        name: name as AppCategories,
        count,
      }))
      .sort(function (a, b) {
        return b.count - a.count;
      }),
    appStore,
    userAdminTeams: userAdminTeamsIds,
  };

  return <AppsPage {...props} isAdmin={session?.user?.role === "ADMIN"} />;
};

export default ServerPage;
