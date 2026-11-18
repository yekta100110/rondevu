import { CALCOM_VERSION } from "@rondevu/lib/constants";
import { trpc } from "@rondevu/trpc/react";

export function useViewerI18n(locale: string) {
  return trpc.viewer.i18n.get.useQuery(
    { locale, CalComVersion: CALCOM_VERSION },
    {
      /**
       * i18n should never be clubbed with other queries, so that it's caching can be managed independently.
       **/
      trpc: {
        context: { skipBatch: true },
      },
    }
  );
}
