import { APP_NAME } from "@calcom/lib/constants";
import { _generateMetadata } from "app/_utils";
import { PlanBilgiView } from "~/plan-bilgi/plan-bilgi-view";

export const generateMetadata = async () => {
  return await _generateMetadata(
    () => `${APP_NAME} - Plan Bilgilendirme ve Danışma`,
    () => `${APP_NAME} plan aktivasyonu ve danışma bilgileri.`,
    true,
    undefined,
    "/plan-bilgi"
  );
};

export default function PlanBilgiPage() {
  return <PlanBilgiView />;
}
