"use client";

import SettingsHeader from "@rondevu/features/settings/appDir/SettingsHeader";
import { APP_NAME } from "@rondevu/lib/constants";
import { useLocale } from "@rondevu/lib/hooks/useLocale";
import { SkeletonText, SkeletonContainer } from "@rondevu/ui/components/skeleton";

export const SkeletonLoader = () => {
  const { t } = useLocale();

  return (
    <SettingsHeader
      title={t("api_keys")}
      description={t("create_first_api_key_description", { appName: APP_NAME })}
      borderInShellHeader={true}>
      <SkeletonContainer>
        <div className="divide-subtle border-subtle stack-y-6 rounded-b-lg border border-t-0 px-6 py-4">
          <SkeletonText className="h-8 w-full" />
          <SkeletonText className="h-8 w-full" />
        </div>
      </SkeletonContainer>
    </SettingsHeader>
  );
};
