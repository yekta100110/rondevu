import { getServerSession } from "@calcom/features/auth/lib/getServerSession";
import { APP_NAME } from "@calcom/lib/constants";
import { buildLegacyRequest } from "@lib/buildLegacyCtx";
import { _generateMetadata } from "app/_utils";
import { cookies, headers } from "next/headers";
import { HomeView } from "~/home/home-view";

const generateMetadata = async () => {
  return await _generateMetadata(
    () => `${APP_NAME} - Sade ve Zahmetsiz Randevu Planlama`,
    () => `${APP_NAME} ile randevularınızı ve toplantılarınızı zahmetsizce yönetin.`,
    true,
    undefined,
    "/"
  );
};

const HomePage = async () => {
  const session = await getServerSession({ req: buildLegacyRequest(await headers(), await cookies()) });
  const isLoggedIn = !!session?.user?.id;

  return <HomeView isLoggedIn={isLoggedIn} />;
};

export { generateMetadata };
export default HomePage;
